const { model, Schema } = require('mongoose');

let relationshipsSchema = new Schema({
  Guild: String,
  User: String,
  Spouse: String,
})

module.exports = model('relationships', relationshipsSchema);