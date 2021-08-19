const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
// MONGO
const uri = process.env.MONGO_DATABASE;
const client = new MongoClient(uri);
const connectDB = async () => {
  try {
  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false 
  })
  await client.connect();
  console.log('client and db conected !!')
} catch (error) {
  await  client.close()
  console.log(error)
}
}


module.exports = {connectDB, client}