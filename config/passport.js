const passport = require('passport')
const User = require('../models/user')
const FacebookStrategy = require('passport-facebook');

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.serializeUser(function(user, done) {
  done(null, user._id)
})
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (!err) done(null, user)
    else done(err, null)
  })
})

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.ON_PROD == '1' ? process.env.FACEBOOK_CALLBACK_URL : 'http://localhost:3000/',
  // passReqToCallback: true,
  profileFields: ['email','id', 'first_name', 'gender', 'last_name', 'picture'],
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile.displayName)
  // User.findOne({facebookId: profile.id}, (err, user) => {
  //   if (err) return done(err)
  //   if (user) return done(null, user)
  //   else {
  //     var newUser = new User()
  //     newUser.facebookId = profile.id
  //     newUser.name = profile.displayName
  //     newUser.image = profile.photos[0].value
  //     newUser.email = profile.email

  //     newUser.save((err) => {
  //       if(err) throw err
  //       return done(null, newUser)
  //     })
  //   }
  // })
}))

module.exports = passport