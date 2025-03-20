/**
 * Script to initialize default roles and permissions
 * Run with: node scripts/init-roles.js
 */
const { connectDB } = require('../db/connect');
const { createRole, createPermission } = require('../services/auth.service');
const { logger } = require('../utils/logger');
const appConfig = require('@quick-bite/app-config').default;

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

    // Get resources, actions, and scopes from app config
    const resources = Object.values(appConfig.RESOURCES);
    const actions = Object.values(appConfig.ACTIONS);
    const scopes = Object.values(appConfig.SCOPES);

    // Create permissions for each resource, action, and scope
    const permissionsMap = {};

    for (const resource of resources) {
      permissionsMap[resource] = {};

      for (const action of actions) {
        permissionsMap[resource][action] = {};

        for (const scope of scopes) {
          const name = `${action}-${resource}-${scope}`;
          const description = `Permission to ${action} ${resource} with ${scope} scope`;

          try {
            const permission = await createPermission({
              name,
              description,
              resource,
              action,
              scope,
            });

            permissionsMap[resource][action][scope] = permission._id;
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
    }

    // Create super admin role with all global permissions
    const allGlobalPermissions = [];
    for (const resource of resources) {
      for (const action of actions) {
        allGlobalPermissions.push(permissionsMap[resource][action].global);
      }
    }

    try {
      await createRole({
        name: appConfig.ROLES.SUPER_ADMIN,
        description: 'Super administrator with all permissions',
        permissions: allGlobalPermissions,
      });
      logger.info(`Created role: ${appConfig.ROLES.SUPER_ADMIN}`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: ${appConfig.ROLES.SUPER_ADMIN}`);
      }
      else {
        throw error;
      }
    }

    // Create admin role with global management permissions
    const adminPermissions = resources.map(
      resource => permissionsMap[resource].manage.global,
    );

    try {
      await createRole({
        name: appConfig.ROLES.ADMIN,
        description: 'Administrator with management permissions',
        permissions: adminPermissions,
      });
      logger.info(`Created role: ${appConfig.ROLES.ADMIN}`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: ${appConfig.ROLES.ADMIN}`);
      }
      else {
        throw error;
      }
    }

    // Create restaurant owner role
    const restaurantOwnerPermissions = [
      // Global read permissions
      permissionsMap.restaurant.read.global,
      permissionsMap['menu-item'].read.global,
      permissionsMap.order.read.global,
      permissionsMap.review.read.global,
      permissionsMap.discount.read.global,

      // Own restaurant management
      permissionsMap.restaurant.update.own,

      // Global menu item management for their restaurant
      permissionsMap['menu-item'].create.global,
      permissionsMap['menu-item'].update.global,
      permissionsMap['menu-item'].delete.global,

      // Order management
      permissionsMap.order.update.global,

      // Discount management
      permissionsMap.discount.create.global,
      permissionsMap.discount.update.global,
      permissionsMap.discount.delete.global,
    ];

    try {
      await createRole({
        name: appConfig.ROLES.RESTAURANT_OWNER,
        description:
          'Restaurant owner with permissions to manage their restaurant and menu items',
        permissions: restaurantOwnerPermissions,
      });
      logger.info(`Created role: ${appConfig.ROLES.RESTAURANT_OWNER}`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: ${appConfig.ROLES.RESTAURANT_OWNER}`);
      }
      else {
        throw error;
      }
    }

    // Create restaurant staff role
    const restaurantStaffPermissions = [
      // Global read permissions
      permissionsMap.restaurant.read.global,
      permissionsMap['menu-item'].read.global,
      permissionsMap.order.read.global,
      permissionsMap.review.read.global,

      // Order management
      permissionsMap.order.update.global,
    ];

    try {
      await createRole({
        name: appConfig.ROLES.RESTAURANT_STAFF,
        description: 'Restaurant staff with permissions to manage orders',
        permissions: restaurantStaffPermissions,
      });
      logger.info(`Created role: ${appConfig.ROLES.RESTAURANT_STAFF}`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: ${appConfig.ROLES.RESTAURANT_STAFF}`);
      }
      else {
        throw error;
      }
    }

    // Create customer role
    const customerPermissions = [
      // Global read permissions
      permissionsMap.restaurant.read.global,
      permissionsMap['menu-item'].read.global,
      permissionsMap.review.read.global,

      // Own user management
      permissionsMap.user.read.own,
      permissionsMap.user.update.own,

      // Own order management
      permissionsMap.order.create.own,
      permissionsMap.order.read.own,

      // Own review management
      permissionsMap.review.create.own,
      permissionsMap.review.update.own,
      permissionsMap.review.delete.own,
    ];

    try {
      await createRole({
        name: appConfig.ROLES.CUSTOMER,
        description: 'Regular customer with basic permissions',
        permissions: customerPermissions,
      });
      logger.info(`Created role: ${appConfig.ROLES.CUSTOMER}`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: ${appConfig.ROLES.CUSTOMER}`);
      }
      else {
        throw error;
      }
    }

    // Create delivery person role
    const deliveryPersonPermissions = [
      // Global read permissions
      permissionsMap.restaurant.read.global,

      // Own user management
      permissionsMap.user.read.own,
      permissionsMap.user.update.own,

      // Order management (assigned orders)
      permissionsMap.order.read.global,
      permissionsMap.order.update.own,

      // Own delivery person profile
      permissionsMap['delivery-person'].read.own,
      permissionsMap['delivery-person'].update.own,
    ];

    try {
      await createRole({
        name: appConfig.ROLES.DELIVERY_PERSON,
        description: 'Delivery person with permissions to manage deliveries',
        permissions: deliveryPersonPermissions,
      });
      logger.info(`Created role: ${appConfig.ROLES.DELIVERY_PERSON}`);
    }
    catch (error) {
      // Skip if role already exists
      if (error.code === 11000) {
        logger.info(`Role already exists: ${appConfig.ROLES.DELIVERY_PERSON}`);
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
