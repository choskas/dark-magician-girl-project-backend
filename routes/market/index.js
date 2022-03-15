const { Router } = require("express");
const router = Router();
const axios = require("axios");
const StockCard = require("../../models/market/StockCard");

const sameId = (a, b) => a.id == b.id;

const getArrayDifference = (left, right, compareFunction) => 
  left.filter(leftValue =>
    !right.some(rightValue => 
      compareFunction(leftValue, rightValue)));

router.get("/poblate-db", async (req, res, next) => {
    try {
        const apiResponse = await axios.get(`${process.env.YGO_API}/cardinfo.php`);
        const transformData = await apiResponse.data.data.map((item) => {
            const newObj = {
                id: item.id,
                name: item.name,
                type: item.type,
                description: item.desc,
                atk: item.atk,
                def: item.def,
                level: item.level,
                race: item.race,
                attribute: item.attribute,
                sets: item.card_sets && item.card_sets.map((set) => ({
                    setName: set.set_name,
                    setCode: set.set_code,
                    setRarity: set.set_rarity,
                    setRarityCode: set.set_rarity_code,
                    setPrice: ((parseFloat(set.set_price) * 20) - ((parseFloat(set.set_price) * 20) * .15) ).toFixed(2),
                    setQuantity: 0,
                })),
                images: item.card_images && item.card_images.map((image) => ({ 
                    imageLarge: image.image_url,
                    imageSmall: image.image_url_small
                }))
            }
            return newObj;
        });
        const stockCard = await StockCard.find({});
        const difference = getArrayDifference(transformData, stockCard, sameId)
        await StockCard.insertMany(difference);
        res.status(200).json({message: 'Db updated successfully',data: difference, success: false})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al migrar dbs", success: false });
    }
});

module.exports = router