const { Router } = require("express");
const Client = require("../../models/market/Client");
const router = Router();


router.post("/login", async (req, res, next) => {
    try {
       const {name, lastName, image, loginInfo} = req.body; 
       const client = await Client.findOne({loginInfo: {id: loginInfo.id}});
       if (client) {
        res.status(200).json({message: 'Inicio de sesion exitoso', data: client, success: true})
        return;
       }
        await Client.create({name, lastName, image, loginInfo});
        res.status(200).json({message: 'Usuario creado', data: {name, lastName, image, loginInfo}, success: true})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear usuario" });
    }
});

module.exports = router