const {Router} = require('express');
const axios = require('axios')
const passport = require('../config/passport')
const router = Router();
const User = require('../models/user');
const client = require('../db/dbConnect');
const ObjectID = require('mongodb').ObjectID

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

router.get('/allCards', async (req,res,next) => {
  const cards = await axios.get(`${process.env.YGO_API}/cardinfo.php?`);
  res.status(200).json({cards: cards.data.data})
})

router.post('/selectRole', async (req, res, next) => {
  try {
    await client.connect();
    const id = new ObjectID(req.body.id); 
    const collection = await client.db(process.env.MONGO_DB_NAME).collection('users');
    const user = await collection.findOneAndUpdate({_id: id}, {$set: {role: req.body.role}})
    res.status('200').json({message: `Todo ha salido bien, redirigiendo!`})
    client.close()
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
    client.close()
  }
})

module.exports = router;