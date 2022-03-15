const { Schema, model } = require('mongoose')
const mongoose = require('mongoose');

const stockCardSchema = new Schema({
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
    setCode: {
        type: String
    },
    images: {
        type: Array
    },
    quantity: {
        type: String
    },
    price: {
        type: String
    },
    rarity: {
        type: String
    },
    rarityCode: {
        type: String
    },
    setName: {
        type: String
    },
  lastUpdateAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const storeDB = mongoose.connection.useDb(process.env.MONGO_DB_NAME_STORE);

const StockCard = storeDB.model('StockCard', stockCardSchema);

module.exports = StockCard;