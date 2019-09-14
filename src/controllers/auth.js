const bcrypt = require('bcrypt');
const validator = require('validator');
const _ = require('lodash');
const User = require('../mongo/models/user');

// create a new user and save into db
const register = async data => {
  const { username, email } = data;
  let { password } = data;

  if (!validator.isEmail(email)) throw new Error('invalid email');

  password = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password
  });
  return _.omit(user.toObject(), 'password', '__v');
};

// login user and creates a jwt token
const login = async data => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error('No existe un usuario registrado con el email ');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (isValidPassword) {
    return _.omit(user.toObject(), 'password', '__v');
  }
  throw new Error('Contraseña invalida');
};

module.exports = {
  register,
  login
};
