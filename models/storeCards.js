const { Schema, model } = require('mongoose')

const storeCardsSchema = new Schema(
  {
    decksBases: {
      type: Array,
    },
    uniqueCards: {
      type: Array,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }
  },
 
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model('StoreCards', storeCardsSchema)