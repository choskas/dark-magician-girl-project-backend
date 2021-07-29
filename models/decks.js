const { Schema, model } = require('mongoose')

const decksSchema = new Schema(
  {
    deckName: {
      type: String,
    },
    deckType: {
      type: String,
    },
    deck: {
      type: Array,
      required: true,
    },
    deckPrice: {
      type: Number,
    },
    mainCard:{
      type: String,
      default: 'https://m.media-amazon.com/images/I/51CrGxrLXFL._AC_.jpg'
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

module.exports = model('Decks', decksSchema)