const { Router } = require("express");
const mongoose = require('mongoose');
const router = Router();
const StoreCards = require("../models/storeCards");
const ObjectID = require("mongodb").ObjectID;

router.get('/getAllUniqueCardsById', async (req, res, next) => {
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
    const id = mongoose.Types.ObjectId();
    if (exist) {
        await StoreCards.findOneAndUpdate({userId}, { $push: { uniqueCards: {cardId: id,...card} }},)
    } else {
    await StoreCards.create({
      userId,
      email,
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

module.exports = router;
