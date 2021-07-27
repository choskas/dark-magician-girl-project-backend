const passport = require("passport");
const User = require("../models/user");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function (user, cb) {
  console.log(user, 'serial')
  cb(null, user);
});

passport.deserializeUser(function (obj, done) {
  console.log(obj, 'deseri')
  User.findById(obj._id, function (err, user) {
    if (!err) {
      console.log(user, 'el user')
      done(null, user);
    } else {
      done(err, null);
      console.log(err, 'el err')
      console.log(err, "err");
    }
  });
});

// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
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

// passport.serializeUser(function (user, done) {
//   console.log(user, 'serialize')
//   done(null, user._id);
// });
// passport.deserializeUser(function (id, done) {
//   console.log("pass deserializauser", id);
//   User.findById(id, function (err, user) {
//     if (!err) {
//       done(null, user);
//     } else {
//       done(err, null);
//       console.log(err, "err");
//     }
//   });
// });

module.exports = passport;
