const UserModel = require('../models/user.model');

async function getUserByID(id, projection = 'name email') {
  return UserModel.findById(id, projection);
}

async function getUser(filters, projection = 'name email') {
  return UserModel.findOne(filters, projection);
}

async function updateUser(id, data) {
  return UserModel.findByIdAndUpdate(id, data, { new: true });
}

async function createUser(data) {
  const user = new UserModel(data);
  await user.save();
  return user;
}

module.exports = {
  getUserByID,
  getUser,
  updateUser,
  createUser,
};
