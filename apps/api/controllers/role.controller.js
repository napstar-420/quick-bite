const { validationResult, matchedData } = require('express-validator');

const Permission = require('../models/permission.model');
const Role = require('../models/role.model');
const {
  createRole,
  createPermission,
  assignRolesToUser,
  removeRolesFromUser,
} = require('../services/auth.service');
const { logger } = require('../utils/logger');

/**
 * Get all roles
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getAllRoles(req, res) {
  try {
    const roles = await Role.find().populate('permissions');
    return res.status(200).json(roles);
  }
  catch (error) {
    logger.error(`Get all roles error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get a role by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getRoleById(req, res) {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json(role);
  }
  catch (error) {
    logger.error(`Get role by ID error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Create a new role
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function createNewRole(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, permissions } = matchedData(req);

    // Check if role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }

    const role = await createRole({ name, description, permissions });
    return res.status(201).json(role);
  }
  catch (error) {
    logger.error(`Create role error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Update a role
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function updateRole(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, permissions } = matchedData(req);

    // Check if role exists
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if new name conflicts with existing role
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'Role with this name already exists' });
      }
      role.name = name;
    }

    if (description) {
      role.description = description;
    }

    if (permissions) {
      role.permissions = permissions;
    }

    await role.save();
    return res.status(200).json(role);
  }
  catch (error) {
    logger.error(`Update role error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Delete a role
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function deleteRole(req, res) {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.deleteOne();
    return res.status(200).json({ message: 'Role deleted successfully' });
  }
  catch (error) {
    logger.error(`Delete role error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get all permissions
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getAllPermissions(req, res) {
  try {
    const permissions = await Permission.find();
    return res.status(200).json(permissions);
  }
  catch (error) {
    logger.error(`Get all permissions error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Create a new permission
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function createNewPermission(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, resource, action } = matchedData(req);

    // Check if permission with the same resource and action already exists
    const existingPermission = await Permission.findOne({ resource, action });
    if (existingPermission) {
      return res.status(400).json({
        message: `Permission for ${action} on ${resource} already exists`,
      });
    }

    const permission = await createPermission({ name, description, resource, action });
    return res.status(201).json(permission);
  }
  catch (error) {
    logger.error(`Create permission error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Assign roles to a user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function assignRoles(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, roleIds } = matchedData(req);

    const user = await assignRolesToUser(userId, roleIds);
    return res.status(200).json(user);
  }
  catch (error) {
    logger.error(`Assign roles error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

/**
 * Remove roles from a user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function removeRoles(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, roleIds } = matchedData(req);

    const user = await removeRolesFromUser(userId, roleIds);
    return res.status(200).json(user);
  }
  catch (error) {
    logger.error(`Remove roles error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  createNewRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  createNewPermission,
  assignRoles,
  removeRoles,
};
