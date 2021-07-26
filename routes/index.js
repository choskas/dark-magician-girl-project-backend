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
      console.log(error)
     res.status(500).json({message: 'El usuario ya existe, haz login!'})
    }
  })

router.post('/signupFacebook', async (req,res,next) =>{
    try {
    const user = await User.create(req.body)
    res.status(201).json({ user })
    } catch (error) {
      console.log(error)
     res.status(500).json({message: 'El usuario ya existe, haz login!'})
    }
  })

router.post('/login', passport.authenticate('local'), async (req,res,next) =>{
    try {
    const { user } = req 
    res.status(200).json({email: user.email, name: user.name, image: user.image})
    } catch (error) {
        res.status(500).json({message: 'Error en credenciales'})
    }
  })

  router.post('/loginFacebook', async (req,res,next) =>{
    try {
    if(req.body.facebookId) {
      const users = await User.find();
      const foundUser = users.find((item) => item.facebookId === req.body.facebookId);
      req.session.user = foundUser.email
      req.session.name = foundUser.name
      req.session.image = foundUser.image
      res.status(200).json({email: foundUser.email, name: foundUser.name, image: foundUser.image})
    } 
    } catch (error) {
        res.status(500).json({message: 'Error en credenciales'})
    }
  })

  router.post('/logout', async (req,res,next) =>{
    try {
    req.session.destroy()
    } catch (error) {
        res.status(500).json({message: 'Error en credenciales'})
    }
  })

module.exports = router;