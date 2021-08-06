const { Schema, model } = require('mongoose')

const wantedCardsSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    cards: {
      type: Array,
    },
  },
 
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model('WantedCards', wantedCardsSchema)