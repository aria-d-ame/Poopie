const { model, Schema } = require('mongoose');

let marrySchema = new Schema({
  Guild: String,
  UserOne: String,
  UserTwo: String,
  Ring: Number,
  RingID: Number,
})

module.exports = model('marry', marrySchema);