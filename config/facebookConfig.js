const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

const facebookPassport = () => {
    return passport.user(new FacebookStrategy, {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: proccess.env.FACEBOOK_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
      console.log(profile)
    })
  }

module.exports = facebookPassport;