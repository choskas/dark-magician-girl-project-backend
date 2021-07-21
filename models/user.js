const { Schema, model } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      default: 'https://www.uic.mx/posgrados/files/2018/05/default-user.png'
    },
    role: {
      type: String,
      enum: ['store', 'client'],
      default: 'client'
    },
  },
 
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.plugin(PLM, {
  usernameField: 'email'
})

module.exports = model('User', userSchema)