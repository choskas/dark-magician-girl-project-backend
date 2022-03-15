const { Router } = require("express");
const router = Router();
const axios = require("axios");
const CardsDB = require("../../models/market/CardsDb");

router.get("/poblate-db", async (req, res, next) => {
    try {
        const apiResponse = await axios.get(`${process.env.YGO_API}/cardinfo.php`);
        const transformData = await apiResponse.data.data.map((item) => {
            const newObj = {
                name: item.name,
                type: item.type,
                description: item.type,
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
                    setPrice: set.set_price
                })),
                images: item.card_images && item.card_images.map((image) => ({ 
                    imageLarge: image.image_url,
                    imageSmall: image.image_url_small
                }))
            }
            return newObj;
        });
        await CardsDB.create(transformData);
        res.status(200).json({message: 'Db poblated successfully',data: transformData})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al migrar dbs" });
    }
});

module.exports = router