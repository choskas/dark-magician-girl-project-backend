const { Router } = require("express");
const router = Router();
const axios = require("axios");
const StockCard = require("../../models/market/StockCard");

router.put("/update-stock", async (req, res, next) => {
    try {
        const {setCode, quantity, price} = req.body;
        await StockCard.findOneAndUpdate({sets: {$elemMatch: {setCode}}}, {$set: {
            "sets.$.setQuantity": quantity,
            "sets.$.setPrice": price,
            "lastUpdateAt": new Date()
        }});

        res.status(200).json({message: 'Carta agregada a stock', data: [], success: true})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al crear carta en stock", success: false });
    }
});

router.get('/recently-added', async (req, res, next) => {
    try {
        const getRecentlyAddedCards = await StockCard.find().limit(10).sort({lastUpdateAt: -1});
        res.status(200).json({message: 'Cartas obtenidas', data: getRecentlyAddedCards, success: true})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error al obtener cartas recientemente añadidas", 
            data: null, 
            success: false})
    }
});

module.exports = router