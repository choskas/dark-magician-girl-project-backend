const {Router} = require('express');
const axios = require('axios')
const passport = require('../config/passport')
const router = Router();
const User = require('../models/user');

const isAuth = (req,res,next) => {
  req.isAuthenticated() ? next() : res.status(401).json({msg: 'Log in first'})
}

router.post('/signup', async (req,res,next) =>{
    try {
    const user = await User.register(req.body, req.body.password)
    res.status(201).json({ user })
    } catch (error) {
      console.log(error)
     res.status(500).json({message: 'El usuario ya existe, haz login!'})
    }
  })

module.exports = router;