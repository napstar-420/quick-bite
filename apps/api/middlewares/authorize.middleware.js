const { hasPermission } = require('../services/auth.service');
const { logger } = require('../utils/logger');

/**
 * Middleware to check if the user has the required permissions
 * @param {string} resource - The resource being accessed
 * @param {string} action - The action being performed (create, read, update, delete, manage)
 * @param {object} [options] - Additional options
 * @param {Function} [options.getOwnerIds] - Function to extract owner ID from request
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

      // Get resource owner ID if provided
      let resourceOwnerId = [];
      if (options.getOwnerIds) {
        resourceOwnerId = options.getOwnerIds(req);
      }

      // Check if user has permission for this resource and action
      const userHasPermission = await hasPermission(
        userId,
        resource,
        action,
        resourceOwnerId,
      );

      if (!userHasPermission) {
        return res.status(403).json({
          message: `You don't have permission to ${action} this ${resource}`,
        });
      }

      // Add user ID to request object for use in controllers
      req.user_id = userId;
      next();
    }
    catch (error) {
      logger.error(`Authorization error: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

module.exports = authorize;
