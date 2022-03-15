const { Schema, model } = require('mongoose')
const mongoose = require('mongoose');

const purchaseSchema = new Schema({
    client: {
        type: Object
    },
    name: {
        type: String
    },
    setCode: {
        type: String,
    },
    setName:{
        type: String,
    },
    setRarity: {
        type: String,
    },
    setQuantity:{
        type: String,
    },
    type:{
        type: String
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        default: 'En proceso'
    }
});

const storeDB = mongoose.connection.useDb(process.env.MONGO_DB_NAME_STORE);

const Purchase = storeDB.model('Purchase', purchaseSchema);

module.exports = Purchase;