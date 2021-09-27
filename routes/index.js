const { Router } = require("express");
const axios = require("axios");
const router = Router();
const { client } = require("../db/dbConnect");
const ObjectID = require("mongodb").ObjectID;
const multer = require('multer');
const fileStorageSystem = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/' )
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: fileStorageSystem })

const isAuth = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.status(401).json({ msg: "Log in first" });
};

router.get("/allCards", async (req, res, next) => {
  const cards = await axios.get(`${process.env.YGO_API}/cardinfo.php?`);
  res.status(200).json({ cards: cards.data.data });
});

router.post("/selectRole", async (req, res, next) => {
  try {
    const id = new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { role: req.body.role } }
    );
    res.status("200").json({ message: `Todo ha salido bien, redirigiendo!` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.put("/storeExtraInfo", async (req, res, next) => {
  try {
    const {
      storeName,
      street,
      postalCode,
      number,
      city,
      facebookLink,
      instagramLink,
      twitterLink,
      phoneNumber,
    } = req.body;
    const id = await new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          storeName,
          address: {
            street,
            postalCode,
            number,
            city,
          },
          contact: {
            facebookLink,
            instagramLink,
            twitterLink,
            phoneNumber,
          },
        },
      }
    );
    res.status(200).json({ message: "Registro exitoso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.put("/updateStoreExtraInfo", async (req, res, next) => {
  try {
    const {
      storeName,
      street,
      postalCode,
      number,
      city,
      facebookLink,
      instagramLink,
      twitterLink,
      phoneNumber,
    } = req.body;
    const id = await new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          storeName,
          address: {
            street,
            postalCode,
            number,
            city,
          },
          contact: {
            facebookLink,
            instagramLink,
            twitterLink,
            phoneNumber,
          },
        },
      }
    );
    res
      .status(200)
      .json({
        message:
          "La información sera actualziada la proxima vez que inicies sesión",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.post("/getStoreById", async (req, res, next) => {
  try {
    const id = await new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOne({ _id: id });
    res.status("200").json({
      store: {
        address: user.address,
        contact: user.contact,
        storeName: user.storeName,
        profileImageKey: user.profileImageKey,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.get("/getAllArchetypes", async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.YGO_API}/archetypes.php`);
    res.status(200).json({archetypes: response.data});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

  router.post('/uploadProfileImage', upload.single('profileImage') ,async (req, res, next) => {
    try {
      const fileData = req.file;
      const userId = await new ObjectID(req.body.userId);
      const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
      const dbResponse = await collection.findOneAndUpdate({_id: userId},       {
          $set: {
            profileImageKey: fileData.filename
          },
        });
      res.status(200).json({message: 'Imagen cambiada con exito!', imageKey: fileData.filename})
    } catch (error) {
      console.log(error)
      res.status(500).json({message: error})
    }
  })

  router.post('/uploadProfileImageDuelist', upload.single('profileImage') ,async (req, res, next) => {
    try {
      const fileData = req.file;
      const userId = await new ObjectID(req.body.userId);
      const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
      const dbResponse = await collection.findOneAndUpdate({_id: userId},       {
          $set: {
            profileImageKey: fileData.filename
          },
        });
      res.status(200).json({message: 'Imagen cambiada con exito!', imageKey: fileData.filename})
    } catch (error) {
      console.log(error)
      res.status(500).json({message: error})
    }
  })

  router.post('/updateArchetype',async (req, res, next) => {
    try {
      const userId = await new ObjectID(req.body.userId);
      const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
      const dbResponse = await collection.findOneAndUpdate({_id: userId},       {
          $set: {
            favouriteArchetype: req.body.favouriteArchetype
          },
        });
      res.status(200).json({message: 'Arquetipo cambiado con exito!'})
    } catch (error) {
      console.log(error)
      res.status(500).json({message: error})
    }
  })

module.exports = router;
