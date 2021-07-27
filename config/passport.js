const passport = require('passport')
const User = require('../models/user')
const FacebookStrategy = require('passport-facebook');

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.ON_PROD == '1' ? process.env.FACEBOOK_CALLBACK_URL : 'http://localhost:3001/loginFacebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  const userFB = User.find(async(item) => {
    if (item.facebookId === profile.id){
      return item
    } else {
      const newUser = await User.create({
        email: profile.email,
        image: profile.picture,
        facebookId: profile.id,
        name: profile.displayName
      })
      done(null, user);
      return newUser;
    }
  })
  return userFB;
}))

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

module.exports = passport