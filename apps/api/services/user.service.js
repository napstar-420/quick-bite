const UserModel = require('../models/user.model');

async function getUserByID(id, projection = 'name email') {
  return UserModel.findById(id, projection);
}

async function getUser(filters, projection = 'name email phone') {
  return UserModel.findOne(filters, projection);
}

async function getUsers(
  filters = {},
  projection = 'name email phone',
  options = { page: 1, limit: 10 },
) {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  const queryFilters = { ...filters };

  if (filters.status) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (filters.status === 'suspended') {
      queryFilters.suspended = true;
    }
    else if (filters.status === 'inactive') {
      queryFilters.suspended = false;
      queryFilters.lastActive = { $lt: thirtyDaysAgo };
    }
    else if (filters.status === 'active') {
      queryFilters.suspended = false;
      queryFilters.lastActive = { $gte: thirtyDaysAgo };
    }
    delete queryFilters.status;
  }

  const users = await UserModel.find(queryFilters, projection)
    .skip(skip)
    .limit(limit);

  const total = await UserModel.countDocuments(queryFilters);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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
  getUsers,
};
