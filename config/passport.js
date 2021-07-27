const passport = require("passport");
const User = require("../models/user");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.ON_PROD == "1"
          ? process.env.FACEBOOK_CALLBACK_URL
          : "http://localhost:3000/",
      profileFields: [
        "email",
        "id",
        "first_name",
        "gender",
        "last_name",
        "picture",
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        else {
          var newUser = new User();
          newUser.facebookId = profile.id;
          newUser.name = profile.name.givenName;
          newUser.image = profile.photos[0].value;
          newUser.email = profile.emails[0].value;

          newUser.save((err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  console.log(user, 'serial')
  cb(null, user._id);
});

passport.deserializeUser(function async (user, cb) {
  console.log(user, 'deseri')
  User.findById(user, (err, user) => {
    console.log(user, 'eluser');
    cb(null, user)
  });
 
});


module.exports = passport;
