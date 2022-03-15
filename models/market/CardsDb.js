const { Schema, model } = require('mongoose')
const mongoose = require('mongoose');

const cardsDbSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    description: {
        type: String
    },
    atk: {
        type: String
    },
    def: {
        type: String
    },
    level: {
        type: String
    },
    race: {
        type: String
    },
    attribute: {
        type: String
    },
    sets: {
        type: Array
    },
    images: {
        type: Array
    },
  lastUpdateAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const storeDB = mongoose.connection.useDb(process.env.MONGO_DB_NAME_STORE);

const CardsDB = storeDB.model('CardsDB', cardsDbSchema);

module.exports = CardsDB;