const {Router} = require('express');
const axios = require('axios')
const passport = require('../config/passport')
const router = Router();
const User = require('../models/user')

router.post('/signup', async (req,res,next) =>{
    try {
    const user = await User.register(req.body, req.body.password)
    res.status(201).json({ user })
    } catch (error) {
     res.status(500).json({message: 'El usuario ya existe, haz login!'})
    }
  })

router.post('/login', passport.authenticate('local'), (req,res,next) =>{
    try {
    const { user } = req 
    res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: 'Error en credenciales'})
    }
  })

module.exports = router;