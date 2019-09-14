const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model('user', schema);
module.exports = User;
