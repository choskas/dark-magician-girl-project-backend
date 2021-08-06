const { Router } = require("express");
const router = Router();
const WantedCards = require("../models/wantedCards");

router.post("/add", async (req, res, next) => {
  try {
    const { userId, card } = req.body;
    const getAllWantedCards = await WantedCards.find();
    const exist = await getAllWantedCards.find((item) => {
        if (item && item.userId === userId) {
            return true;
        } else {
            return false;
        }
    })
    if (exist) {
        await WantedCards.findOneAndUpdate({userId}, { $push: { cards: card } },)
    } else {
    await WantedCards.create({
      userId,
      cards: [card],
      isFound: false
    });
}
    res.status(200).json({ message: "Carta agregada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar el deck" });
  }
});

module.exports = router;
