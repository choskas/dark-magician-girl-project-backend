const passport = require("passport");
const User = require("../models/user");
const FacebookStrategy = require("passport-facebook");

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
        if (err)  done(err);
        if (user) {
          done(null, user);
        } else {
          var newUser = new User();
          newUser.facebookId = profile.id;
          newUser.name = profile.name.givenName;
          newUser.image = profile.photos[0].value;
          newUser.email = profile.emails[0].value;

          newUser.save((err) => {
            if (err) throw err;
            done(null, newUser);
          });
        }
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  console.log(user, "serial");
  cb(null, user.facebookId);
});

passport.deserializeUser(function async(obj, cb) {
  console.log(obj, "deseri");
  User.findOne({ facebookId: obj }, (err, user) => {
    console.log(user, "eluser");
    if (!err) cb(null, user)
    if (err) cb(err, null)
  });
});

module.exports = passport;
