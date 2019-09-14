const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  jwt: { type: String, require: true, unique: true },
  payload: { type: Object }
});


const model = mongoose.model('token', schema);

module.exports = model;
