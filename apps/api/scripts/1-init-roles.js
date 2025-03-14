/**
 * Script to initialize default roles and permissions
 * Run with: node scripts/init-roles.js
 */
const { connectDB } = require('../db/connect');
const { createRole, createPermission } = require('../services/auth.service');
const { logger } = require('../utils/logger');

// Connect to MongoDB
connectDB()
  .then(() => {
    initRolesAndPermissions();
  })
  .catch(() => {
    process.exit(1);
  });

async function initRolesAndPermissions() {
  try {
    logger.info('Initializing roles and permissions...');

    // Define resources
    const resources = [
      'user',
      'role',
      'permission',
      'restaurant',
      'menu-item',
      'order',
      'review',
      'discount',
      'notification',
      'delivery-person',
    ];

    // Define actions
    const actions = ['create', 'read', 'update', 'delete', 'manage'];

    // Create permissions for each resource and action
    const permissionsMap = {};

    for (const resource of resources) {
      permissionsMap[resource] = {};

      for (const action of actions) {
        const name = `${action}-${resource}`;
        const description = `Permission to ${action} ${resource}`;

        try {
          const permission = await createPermission({
            name,
            description,
            resource,
            action,
          });

          permissionsMap[resource][action] = permission._id;
          logger.info(`Created permission: ${name}`);
        }
        catch (error) {
          // Skip if permission already exists
          if (error.code === 11000) {
            logger.info(`Permission already exists: ${name}`);
          }
          else {
            throw error;
          }
        }
      }
    }

    // Create super admin role with all permissions
    const allPermissions = Object.values(permissionsMap)
      .flatMap(actionMap => Object.values(actionMap));

    try {
      await createRole({
        name: 'super-admin',
        description: 'Super administrator with all permissions',
        permissions: allPermissions,
      });
      logger.info(`Created role: super-admin`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: super-admin`);
      }
      else {
        throw error;
      }
    }

    // Create admin role with management permissions
    const adminPermissions = resources.map(resource => permissionsMap[resource].manage);

    try {
      await createRole({
        name: 'admin',
        description: 'Administrator with management permissions',
        permissions: adminPermissions,
      });
      logger.info(`Created role: admin`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: admin`);
      }
      else {
        throw error;
      }
    }

    // Create restaurant-manager role
    const restaurantManagerPermissions = [
      permissionsMap.restaurant.read,
      permissionsMap.restaurant.update,
      permissionsMap['menu-item'].manage,
      permissionsMap.order.read,
      permissionsMap.order.update,
      permissionsMap.discount.manage,
      permissionsMap.review.read,
    ];

    try {
      await createRole({
        name: 'restaurant-manager',
        description: 'Restaurant manager with permissions to manage restaurant and menu items',
        permissions: restaurantManagerPermissions,
      });
      logger.info(`Created role: restaurant-manager`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: restaurant-manager`);
      }
      else {
        throw error;
      }
    }

    // Create customer role
    const customerPermissions = [
      permissionsMap.user.read,
      permissionsMap.user.update,
      permissionsMap.restaurant.read,
      permissionsMap['menu-item'].read,
      permissionsMap.order.create,
      permissionsMap.order.read,
      permissionsMap.review.create,
      permissionsMap.review.read,
      permissionsMap.review.update,
      permissionsMap.review.delete,
    ];

    try {
      await createRole({
        name: 'customer',
        description: 'Regular customer with basic permissions',
        permissions: customerPermissions,
      });
      logger.info(`Created role: customer`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: customer`);
      }
      else {
        throw error;
      }
    }

    // Create delivery-person role
    const deliveryPersonPermissions = [
      permissionsMap.user.read,
      permissionsMap.user.update,
      permissionsMap.order.read,
      permissionsMap.order.update,
      permissionsMap['delivery-person'].read,
      permissionsMap['delivery-person'].update,
    ];

    try {
      await createRole({
        name: 'delivery-person',
        description: 'Delivery person with permissions to manage deliveries',
        permissions: deliveryPersonPermissions,
      });
      logger.info(`Created role: delivery-person`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: delivery-person`);
      }
      else {
        throw error;
      }
    }

    logger.info('Roles and permissions initialized successfully');
    process.exit(0);
  }
  catch (error) {
    logger.error(`Error initializing roles and permissions: ${error.message}`);
    process.exit(1);
  }
}
