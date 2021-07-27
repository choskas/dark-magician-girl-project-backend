const {Router} = require('express');
const axios = require('axios')
const passport = require('../config/passport')
const router = Router();
const User = require('../models/user');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
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

  router.get('/loginFacebook',
  passport.authenticate('facebook'));

  // router.get('/loginFacebook', passport.authenticate('facebook') ,async (req,res,next) =>{
  //   try {
  //   // if(req.body.facebookId) {
  //   //   const users = await User.find();
  //   //   const foundUser = users.find((item) => item.facebookId === req.body.facebookId);
  //   //   req.session.user = foundUser.email
  //   //   req.session.name = foundUser.name
  //   //   req.session.image = foundUser.image
  //   //   res.status(200).json({email: foundUser.email, name: foundUser.name, image: foundUser.image})
  //   // } 

  //   } catch (error) {
  //     console.log(error)
  //       res.status(500).json({message: error})
  //   }
  // })

  router.get('/loginFacebook/callback',
    passport.authenticate('facebook', { successRedirect: '/profile',
                                        failureRedirect: '/login' }));

  router.post('/logout', async (req,res,next) =>{
    try {
      req.session.destroy()
      res.status(200).json({message: 'Sesión finalizada con exito'})
    } catch (error) {
        res.status(500).json({message: 'Error en credenciales'})
        console.log(error)
    }
  })

  router.get('/profile', isLoggedIn, function (req, res) {
    res.render('ola', {
      user: req.user // get the user out of session and pass to template
    });
  });
  

module.exports = router;