const { Schema, model } = require('mongoose')
const mongoose = require('mongoose');

const clientSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
    },
    image: {
        type: String,
    },
    address:{
        type: Array,
    },
    loginInfo: {
        type: Object
    }
});

const storeDB = mongoose.connection.useDb(process.env.MONGO_DB_NAME_STORE);

const Client = storeDB.model('Client', clientSchema);

module.exports = Client;