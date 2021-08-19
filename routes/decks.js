const { Router } = require("express");
const router = Router();
const Deck = require("../models/decks");
const StoreCards = require("../models/storeCards");
const ObjectID = require("mongodb").ObjectID;

router.post("/create", async (req, res, next) => {
  try {
    const { deckName, deckType, deck, mainCard, id, deckPrice, email } =
      req.body;
    const getAllDecksById = await Deck.find({id});
    console.log(getAllDecksById.length, 'zz')
    if (getAllDecksById.length <= 9) {
    await Deck.create({
      deckName,
      deckType,
      deck,
      mainCard,
      id,
      email,
      deckPrice,
    });
    return res.status(200).json({ message: "Deck creado" });
  } else {
    return res.status(402).json({message: "No puedes crear mas decks borra alguno."})
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar el deck" });
  }
});

router.post("/createDeckBase", async (req, res, next) => {
  try {
    const { deckName, deckPrice, deck, mainCard, userId, email } = req.body;
    const getStore = await StoreCards.find({userId});
    const deckId = new ObjectID()
    if (getStore.length >= 1){
    await StoreCards.findOneAndUpdate(
      { userId },
      { $push: {decksBases: {deckId, deckName, deckPrice, deck, mainCard } }  }
    );
      return res.status(200).json({ message: "Base guardada" });
    } else {
      await StoreCards.create({
        userId,
        email,
        uniqueCards: [],
        decksBases: [{deckId, deckName, deckPrice, deck, mainCard }],
      });
      return res.status(200).json({ message: "Base guardada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar la base" });
  }
});

router.post("/deleteDeckBase", async (req,res,next) => {
  try {
    const {userId, deckId} = req.body;
    const card = await StoreCards.findOneAndUpdate({userId},{ $pull: { 'deckBases.$.deckId': deckId } } );
    res.status(200).json({message: 'Base borrada.'});

  } catch (error) {
    console.log(error);
    res.status(500).json({message: error})
  }
})

router.post("/getAllUserDecks", async (req, res, next) => {
  try {
    const decks = await Deck.find({ id: req.body.id });
    res.status(200).json({ message: "Decks encontrados", decks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener decks" });
  }
});

router.post("/deleteDeck", async (req, res, next) => {
  try {
    const { _id } = req.body;
    await Deck.findByIdAndDelete({_id});
    return res.status(200).json({ message: "Deck borrado." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al borrar deck" });
  }
});

router.post("/addToWantedCards");

module.exports = router;
