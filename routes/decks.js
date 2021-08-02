const { Router } = require("express");
const router = Router();
const Deck = require("../models/decks");

router.post("/create", async (req, res, next) => {
  try {
    const { deckName, deckType, deck, mainCard, id, deckPrice, email } = req.body;
    await Deck.create({
      deckName,
      deckType,
      deck,
      mainCard,
      id,
      email,
      deckPrice,
    });
    res.status(200).json({ message: "Deck creado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar el deck" });
  }
});

router.post("/getAllUserDecks", async (req, res, next) => {
  try {
    const decks = await Deck.find({id: req.body.id})
    res.status(200).json({message: 'Decks encontrados', decks})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener decks" });
  }
})

router.delete("/deleteDeck", async (req, res, next) => {
  try {
    const decks = await Deck.findOneAndDelete({id: req.body.id})
    res.status(200).json({message: 'Deck eliminado'})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar deck" });
  }
})

// TODO
// router.put("/editDeck", async (req, res, next) => {
//   try {
//     const decks = await Deck.findOneAndUpdate({email: req.body.email, deckName: req.body.deckName})
//     res.status(200).json({message: 'Deck eliminado'})
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error al eliminar deck" });
//   }
// })

module.exports = router;
