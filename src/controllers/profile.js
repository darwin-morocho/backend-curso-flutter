const _ = require('lodash');

const User = require('../mongo/models/user');

// get the unser info from db
const info = async id => {
  const user = await User.findById(id);
  if (!user) throw new Error('user not found');
  return _.omit(user.toObject(), 'password', '__v');
};

const avatar = async (userId, avatarPath) => {
  await User.findByIdAndUpdate(userId, {
    $set: {
      avatar: avatarPath
    }
  });
};

module.exports = {
  info,
  avatar
};
