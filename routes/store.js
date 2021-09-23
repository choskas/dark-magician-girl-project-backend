const { Router } = require("express");
const mongoose = require('mongoose');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const router = Router();
const StoreCards = require("../models/storeCards");
const ObjectID = require("mongodb").ObjectID;
const { client } = require("../db/dbConnect");
const multer = require('multer');
const upload = multer({dest: 'storeProfilesImages/'})
const {uploadFile, getFile, putFile} = require('../config/s3Config');


router.get('/getAllStoresDecksAndCards', async (req, res, next) => {
    try {
        const allStoreDecksDecksAndCards = await StoreCards.find()
        res.status(200).json({stores: allStoreDecksDecksAndCards})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
})

router.post('/getAllUniqueCardsById', async (req, res, next) => {
    try {
        const {userId} = req.body;
        const cards = await StoreCards.findOne({userId})
        res.status(200).json({cards})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error})
    }
})

router.post('/addUniqueCard', async (req, res, next) => {
    try {
    const {card, userId, email} = req.body;
    const getAllStores = await StoreCards.find();
    const exist = getAllStores.find((item) => {
        let isExist;
        if (item && item.userId === userId) {
            isExist = true;
        } else {
            isExist = false;
        }
        return isExist
    })
    const existItem = getAllStores.find((item) => {
        let isExist;
        if (item && item.userId === userId) {
            isExist = item;
        } else {
            isExist = false;
        }
        return isExist
    })
    if (exist && existItem.uniqueCards.length >= 80) {
        return res.status(402).json({message: 'No puedes guardar mas cartas, borra alguna'})
    }
    const alreadyHaveIt = getAllStores.find((item) => {
        let haveIt = false;
        if (item && item.userId === userId) {
           haveIt = item.uniqueCards.find((n) => n.rarityCode === card.rarityCode)
        } else {
            haveIt = false;
        }
        return haveIt
    })
    if (alreadyHaveIt){
        return res.status(402).json({message: 'Ya tienes esta carta en tu perfil'})
    }
    const id = mongoose.Types.ObjectId();
    if (exist) {
        await StoreCards.findOneAndUpdate({userId}, { $push: { uniqueCards: {cardId: id,...card} }},)
    } else {
    await StoreCards.create({
      userId,
      email: email ? email : '',
      uniqueCards: [{cardId: id, ...card}],
      deckBases: [],
    });
    }
    res.status(200).json({message: 'Carta agregada!'})
} catch (error) {
    console.log(error);
    res.status(500).json({message: error})
}
})

router.post('/fastAddUniqueCard', async (req, res, next) => {
    try {
    const {cards, userId, email} = req.body;
    const getAllStores = await StoreCards.find();
    const exist = getAllStores.find((item) => {
        let isExist;
        if (item && item.userId === userId) {
            isExist = true;
        } else {
            isExist = false;
        }
        return isExist
    })
    const existItem = getAllStores.find((item) => {
        let isExist;
        if (item && item.userId === userId) {
            isExist = item;
        } else {
            isExist = false;
        }
        return isExist
    })
    if (exist && existItem.uniqueCards.length >= 80) {
        return res.status(402).json({message: 'No puedes guardar mas cartas, borra alguna'})
    }
    
    if (exist) {
        const cardsArray = cards.map((item) => {
            const id = mongoose.Types.ObjectId();
            return {
                cardId: id,
                name: item.name,
                rarityCode: item.rarityCode,
                image: item.image,
            }
        });
       await StoreCards.findOneAndUpdate({userId}, { $push: { uniqueCards: { "$each": cardsArray } }},)
    } else {
    const cardsArray = cards.map((item) => {
        const id = mongoose.Types.ObjectId();
        return {
            cardId: id,
            name: item.name,
            rarityCode: item.rarityCode,
            image: item.image,
        }
    })
    await StoreCards.create({
      userId,
      email: email ? email : '',
      uniqueCards: cardsArray,
      deckBases: [],
    });
    }
    res.status(200).json({message: 'Cartas agregadas!'})
} catch (error) {
    console.log(error);
    res.status(500).json({message: error})
}
})


router.put('/deleteUniqueCard', async (req, res, next) => {
    try {
        const {cardId, userId} = req.body;
        const id = new ObjectID(cardId);
        const getCard = await StoreCards.findOneAndUpdate({userId}, {$pull:{'uniqueCards': {cardId: id}}})
        res.status(200).json({message: 'Carta borrada!'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error})
    }
})

router.post("/deleteDeckBase", async (req,res,next) => {
    try {
      const {userId, deckId} = req.body;
      const newDeckId = new ObjectID(deckId);
      const card = await StoreCards.findOneAndUpdate({userId},{ $pull: { 'decksBases': {deckId: newDeckId} } } );
      res.status(200).json({message: 'Base borrada.'});
  
    } catch (error) {
      console.log(error);
      res.status(500).json({message: error})
    }
  });

  router.post('/postStoreImage', upload.single('storeProfileImage'), async (req, res, next) => {
    try {
        const file = req.file;
        const userId = await new ObjectID(req.body.userId);
        const imageKey = req.body.imageKey;
        if (imageKey !== 'undefined') {
            await putFile(imageKey, file);
            await unlinkFile(file.path)
            res.status(200).json({message: 'Imagen cambiada con exito!', imageKey})
            return;
        }
        const result = await uploadFile(file);
        const collection = await client
        .db(process.env.MONGO_DB_NAME)
        .collection("users");
        await unlinkFile(file.path)
        const dbResponse = await collection.findOneAndUpdate({_id: userId},       {
            $set: {
              storeProfileImageKey: result.Key
            },
          });
        res.status(200).json({message: 'Imagen agregada con exito!', imageKey: result.Key})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
})

router.post('/getStoreImage',  async (req, res, next) => {
    try {
        const { imageKey } = req.body;
        const readStream = await getFile(imageKey);
        res.status(200).send({image: readStream})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
})

router.post(
    "/upload",
    upload.single("storeProfileImage" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./uploads/image.png");
  
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    }
  );


module.exports = router;
