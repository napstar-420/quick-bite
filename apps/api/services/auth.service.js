const Permission = require('../models/permission.model');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const { logger } = require('../utils/logger');

/**
 * Check if a user has a specific permission
 * @param {string} userId - The user ID
 * @param {string} resource - The resource being accessed
 * @param {string} action - The action being performed
 * @returns {Promise<boolean>} - Whether the user has the permission
 */
async function hasPermission(userId, resource, action) {
  try {
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    });

    if (!user || user.suspended) {
      return false;
    }

    return user.roles.some((role) => {
      return role.permissions.some((permission) => {
        return (
          (permission.resource === resource && permission.action === action)
          || (permission.resource === resource && permission.action === 'manage')
          || (permission.resource === '*' && permission.action === '*')
        );
      });
    });
  }
  catch (error) {
    logger.error(`Permission check error: ${error.message}`);
    return false;
  }
}

/**
 * Create a new role with permissions
 * @param {object} roleData - The role data
 * @param {string} roleData.name - The role name
 * @param {string} roleData.description - The role description
 * @param {Array<string>} roleData.permissions - Array of permission IDs
 * @returns {Promise<object>} - The created role
 */
async function createRole(roleData) {
  try {
    const role = new Role(roleData);
    await role.save();
    return role;
  }
  catch (error) {
    logger.error(`Create role error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a new permission
 * @param {object} permissionData - The permission data
 * @param {string} permissionData.name - The permission name
 * @param {string} permissionData.description - The permission description
 * @param {string} permissionData.resource - The resource
 * @param {string} permissionData.action - The action
 * @returns {Promise<object>} - The created permission
 */
async function createPermission(permissionData) {
  try {
    const permission = new Permission(permissionData);
    await permission.save();
    return permission;
  }
  catch (error) {
    logger.error(`Create permission error: ${error.message}`);
    throw error;
  }
}

/**
 * Assign roles to a user
 * @param {string} userId - The user ID
 * @param {Array<string>} roleIds - Array of role IDs
 * @returns {Promise<object>} - The updated user
 */
async function assignRolesToUser(userId, roleIds) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Add new roles without duplicates
    const uniqueRoles = [...new Set([...user.roles, ...roleIds])];
    user.roles = uniqueRoles;

    await user.save();
    return user;
  }
  catch (error) {
    logger.error(`Assign roles error: ${error.message}`);
    throw error;
  }
}

/**
 * Remove roles from a user
 * @param {string} userId - The user ID
 * @param {Array<string>} roleIds - Array of role IDs to remove
 * @returns {Promise<object>} - The updated user
 */
async function removeRolesFromUser(userId, roleIds) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.roles = user.roles.filter(roleId => !roleIds.includes(roleId));
    await user.save();
    return user;
  }
  catch (error) {
    logger.error(`Remove roles error: ${error.message}`);
    throw error;
  }
}

module.exports = {
  hasPermission,
  createRole,
  createPermission,
  assignRolesToUser,
  removeRolesFromUser,
};
