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
    if (exist) {
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

router.put("/foundCard", async (req, res , next) => {
  try {
    const {userId, rarityCode} = req.body;
    const card = await WantedCards.findOneAndUpdate({userId, 'cards.rarityCode': rarityCode}, 
      {
        $set: {
          'cards.$.isFound': true,
        }
      },
    )
    res.status(200).json({message: 'Se ha notificado al usuario'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
  }
})

module.exports = router;
