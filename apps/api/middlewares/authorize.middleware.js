const { toString } = require('lodash');

const User = require('../models/user.model');
const { logger } = require('../utils/logger');

/**
 * Middleware to check if the user has the required permissions
 * @param {string} resource - The resource being accessed
 * @param {string} action - The action being performed (create, read, update, delete, manage)
 * @param {object} [options] - Additional options
 * @param {Function} [options.getOwnerId] - Function to extract owner ID from request
 * @param {string} [options.ownerField] - Field in user object for ownership (default: '_id')
 * @returns {Function} - Express middleware function
 */
function authorize(resource, action, options = {}) {
  return async (req, res, next) => {
    try {
      // Get user ID from the JWT verification middleware
      const userId = req.user_id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Find the user and populate their roles with permissions
      const user = await User.findById(userId).populate({
        path: 'roles',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.suspended) {
        return res.status(403).json({ message: 'Account suspended' });
      }

      // Permission check for action on resource
      const hasPermission = user.roles.some((role) => {
        return role.permissions.some((permission) => {
          return (
            (permission.resource === resource && permission.action === 'manage')
            || (permission.resource === resource && permission.action === action)
            || (permission.resource === '*' && permission.action === '*')
          );
        });
      });

      if (hasPermission) {
        // Add user to request object for use in controllers
        req.user = user;
        return next();
      }

      // Ownership check
      if (options.getOwnerId) {
        const ownerId = options.getOwnerId(req);

        if (!ownerId) {
          return res.status(403).json({
            message: `You don't have permission to ${action} this ${resource}`,
          });
        }

        const ownerField = options.ownerField || '_id';
        const isOwner = toString(user[ownerField]) === toString(ownerId);

        if (!isOwner) {
          return res.status(403).json({
            message: `You don't have permission to ${action} this ${resource}`,
          });
        }
      }

      // Add user to request object for use in controllers
      req.user = user;
      next();
    }
    catch (error) {
      logger.error(`Authorization error: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

module.exports = authorize;
