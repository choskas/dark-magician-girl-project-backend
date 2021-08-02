const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_DATABASE;
const client = new MongoClient(uri);

module.exports = client;