require('dotenv').config()
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const app = express();
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./db/dbConnect');
const server = http.createServer(app);
const socketIoServer = require('./routes/websockets');


// Middlewares
app.use(helmet());
app.disable('x-powered-by');
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://dark-magician-girl-project.vercel.app', 'https://www.facebook.com', 'https://www.cardsseeker.com', 'https://cardsseeker.com'],
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

// Routes
app.use('/api', require('./routes/index'));
app.use('/api/deck', require('./routes/decks'));
app.use('/api/wantedCards', require('./routes/wantedCards'));
app.use('/api/wantedBases', require('./routes/wantedBases'));
app.use('/api/store', require('./routes/store'));
app.use('/api/market', require('./routes/market/index'));
app.use('/api/market/stock', require('./routes/market/stock'));
app.use('/api/market/client', require('./routes/market/client'));
// Websocket (si se necesitan)
socketIoServer(server);

// Listen server
const PORT = process.env.PORT || 3001;
server.listen(PORT || 3001, () => {
  console.log('listening on port ', PORT);
});
