const { Router } = require("express");
const router = Router();
const Deck = require("../models/decks");

router.post("/addToWantedBases", async (req, res, next) => {
  try {
    const { _id } = req.body;
    const getDecks = await Deck.findByIdAndUpdate(
      { _id },
      {
        $set: {
          isWanted: true,
        },
      }
    );
    res.status(200).json({ message: "Se ha empezado a buscar tu deck" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar deck" });
  }
});

router.post("/stopSearch", async (req, res, next) => {
  try {
    const { _id } = req.body;
    const getDecks = await Deck.findByIdAndUpdate(
      { _id },
      {
        $set: {
          isWanted: false,
        },
      }
    );
    res.status(200).json({ message: "Se ha dejado de buscar tu deck" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al dejar de buscar deck" });
  }
});

router.get("/getAllWantedBases", async (req, res, next) => {
  try {
    const allDecks = await Deck.find({ isWanted: true });
    res.status(200).json({ wantedBases: allDecks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener bases" });
  }
});

router.put("/foundBase", async (req, res, next) => {
  try {
    const { _id, foundBy } = req.body;
    const foundBase = await Deck.findById({ _id });
    const isFoundBase = foundBase.foundBy.find((item) => {
      if (item.foundById === foundBy.foundById) {
        return true;
      } else {
        return false;
      }
    });
    if (isFoundBase) {
      return res
        .status(402)
        .json({ message: "Ya se ha notificado al usuario" });
    } else {
      await Deck.findByIdAndUpdate(
        { _id },
        {
          $set: {
            isFound: true,
            foundBy,
          },
        }
      );
      return res.status(200).json({ message: "Se ha notificado al usuario" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
