const { Router } = require("express");
const router = Router();
const WantedCards = require("../models/wantedCards");

router.post("/add", async (req, res, next) => {
  try {
    const { userId, card, name, email } = req.body;
    const getAllWantedCards = await WantedCards.find();
    const exist = await getAllWantedCards.find((item) => {
        if (item && item.userId === userId) {
            return true;
        } else {
            return false;
        }
    })
    const existItems = await getAllWantedCards.map((item) => {
      if (item && item.userId === userId) {
          return item;
      } else {
          return [];
      }
  })
    if (exist) {
        const cardExist = await WantedCards.findOne({userId});
        const isExistCard = cardExist.cards.find((item) => {
          if (item.rarityCode === card.rarityCode) {
            return true
          } else {
            return false
          }
        } )
        if (isExistCard) {
          return res.status(402).json({message: 'La carta ya esta en tus busquedas'})
        }
        if (existItems.length <= 14){
          return res.status(402).json({message: 'No puedes agregar mas cartas, borra alguna.'})
        }
        await WantedCards.findOneAndUpdate({userId}, { $push: { cards: card }},)
    } else {
    await WantedCards.create({
      userId,
      email,
      name,
      cards: [card],
    });
}
    res.status(200).json({ message: "Carta agregada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar la carta" });
  }
});

router.get("/getAllWantedCards", async (req, res , next) => {
  try {
    const allCards = await WantedCards.find();
    const newCardsArr = allCards.map((user) => {
      return user.cards.map((card) => {
        return {
          userId: user.userId ,
          email: user.email,
          name: user.name,
          card: {image: card.image, rarityCode: card.rarityCode, name: card.name}
        }
      })
    })
    const allCardsArr = newCardsArr.flat()
    res.status(200).json({allCards: allCardsArr})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
  }
})

router.post("/getAllWantedCardsById", async (req,res,next) => {
  try {
    const {userId} = req.body;
    const foundCardsById = await WantedCards.findOne({userId})
    if (foundCardsById) {
    res.status(200).json({cards: foundCardsById.cards});
    } else {
    res.status(200).json({cards: []});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({message: error})
  }
})

router.put("/foundCard", async (req, res , next) => {
  try {
    const {userId, rarityCode, price, foundBy, foundByName} = req.body;
    const cardAlreadyFound = await WantedCards.findOne({userId});
    if (cardAlreadyFound) {
      const foundCardItem = cardAlreadyFound.cards.find((item) => {
        if (item.rarityCode === rarityCode) {
          return item;
        } else {
          return false;
        }
      });
      let alreadyFoundBy = false;
      if (foundCardItem.foundBy) {
      alreadyFoundBy = foundCardItem.foundBy.find((item) => {
        if (item.foundById === foundBy) {
          return true;
        } else {
          return false;
        }
      })
    }
      if (alreadyFoundBy) {
        return res.status(402).json({message: 'Ya se ha notificado al usuario'})
      }
    }

    const card = await WantedCards.findOneAndUpdate({userId, 'cards.rarityCode': rarityCode}, 
      {
        $set: {
          'cards.$.isFound': true,
        },
        $push: {
          'cards.$.foundBy': {foundById: foundBy, foundByName: foundByName, price},
        }
      },
    )
    res.status(200).json({message: 'Se ha notificado al usuario'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
  }
})

router.put("/deleteWantedCard", async (req,res,next) => {
  try {
    const {userId, rarityCode} = req.body;
    const card = await WantedCards.findOneAndUpdate({userId},{ $pull: { 'cards': {rarityCode} } } );
    res.status(200).json({message: 'Carta borrada.'});

  } catch (error) {
    console.log(error);
    res.status(500).json({message: error})
  }
})

module.exports = router;
