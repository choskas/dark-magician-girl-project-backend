const { Router } = require("express");
const Client = require("../../models/market/Client");
const Purchase = require("../../models/market/Purchase");
const router = Router();


router.get("/get-all-purchases", async (req, res, next) => {
    try {
       const purchases = await Purchase.find();
       res.status(200).json({message: 'Compras obtenidas', data: purchases, success: true})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
});

router.get("/get-purchase-order-by-client", async (req, res, next) => {
    try {
        const { id } = req.query;
       const purchases = await Purchase.find({"client.loginInfo.id": id})
       res.status(200).json({message: 'Compras obtenidas', data: purchases, success: true})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
});

router.post("/create-purchase-order", async (req, res, next) => {
    try {
        const {client, setCode, name, setName, setRarity, quantity, type, image } = req.body;
        await Purchase.create({client, setCode, name, setName, setRarity, quantity, type, image});
        res.status(200).json({message: 'Orden creada', data: [], success: true})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear compra" });
    }
});

router.put("/update-purchase-order", async (req, res, next) => {
    try {
        const {id, status } = req.body;
        await Purchase.findByIdAndUpdate(id, {status})
        res.status(200).json({message: 'Orden actualizada', data: [], success: true})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear compra" });
    }
});

module.exports = router