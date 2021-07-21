require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const app = express();
const mongoose = require('mongoose');
const passport = require('./config/passport')

// MONGO
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASSWORD}@cluster0.tl5qv.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`;
const connectDB = async () => {
  try {
  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  console.log('db connected')
} catch (error) {
  console.log(error)
}
}

connectDB();

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

// Middlewares
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(
  cors({
    credentials: false,
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://dark-magician-girl-project.vercel.app/'],
  }),
);

// Middlewares for DDoS and bruteforce attacks
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  delayMs: 0,
});

app.use(limiter);

// Routes
app.use(require('./routes/index'));
// Websocket (si se necesitan)
app.use(require('./routes/websockets'));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Listen server
app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port', 3001);
});
