const { model, Schema } = require('mongoose');

let marrySchema = new Schema({
  Guild: String,
  User: String,
  Spouse: String,
})

module.exports = model('marry', marrySchema);