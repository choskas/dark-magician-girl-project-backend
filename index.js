require('dotenv').config()
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const app = express();
const passport = require('./config/passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./db/dbConnect');

// Middlewares
app.use(helmet());
app.disable('x-powered-by');
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://dark-magician-girl-project.vercel.app', 'https://www.facebook.com'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

connectDB();

// Static
app.use(express.static(path.join(__dirname, 'public')));


// Middlewares for DDoS and bruteforce attacks
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  delayMs: 0,
});

app.use(limiter);
app.set("trust proxy", 1);
app.use(cookieParser())
// MONGO SESSION
const uri = process.env.MONGO_DATABASE;
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 3600000*24*14, domain: process.env.FACEBOOK_APP_URL},
  store: MongoStore.create({
      mongoUrl: uri,
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native'
  })
}));

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use(require('./routes/index'));
app.use('/deck', require('./routes/decks'));
app.use('/wantedCards', require('./routes/wantedCards'));
// Websocket (si se necesitan)
app.use(require('./routes/websockets'));

// Listen server
const PORT = process.env.PORT || 3001;
app.listen(PORT || 3001, () => {
  console.log('listening on port ', PORT);
});
