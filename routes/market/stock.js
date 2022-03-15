const { Router } = require("express");
const router = Router();
const axios = require("axios");
const CardsDB = require("../../models/market/CardsDb");
const StockCard = require("../../models/market/StockCard");

router.post("/add-stock", async (req, res, next) => {
    try {
        const {setCode, quantity, price} = req.body;
        const cardExistOnStock = await StockCard.findOne({setCode});
        console.log(cardExistOnStock)
        if (cardExistOnStock){
            await StockCard.findOneAndUpdate({setCode}, {price, quantity}); 
            res.status(200).json({message: 'Carta actualizada en stock', data: [], success: true})
            return;
        }
        const cardFoundOnDB = await CardsDB.findOne({sets: {$elemMatch: {setCode}}});
        const getSet = cardFoundOnDB.sets.find((item) => item.setCode === setCode);
        const createCardStockObj = {
            name: cardFoundOnDB.name,
            type: cardFoundOnDB.type,
            description: cardFoundOnDB.description,
            atk: cardFoundOnDB.atk,
            def: cardFoundOnDB.def,
            level: cardFoundOnDB.level,
            race: cardFoundOnDB.race,
            attribute: cardFoundOnDB.attribute,
            images: cardFoundOnDB.images,
            quantity,
            price,
            setCode: getSet.setCode,
            setName: getSet.setName,
            rarity: getSet.setRarity,
            rarityCode: getSet.setRarityCode,    
        };
        await StockCard.create(createCardStockObj);
        res.status(200).json({message: 'Carta agregada a stock', data: [], success: true})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al crear carta en stock", success: false });
    }
});

module.exports = router