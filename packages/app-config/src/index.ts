const PASS_MIN_LENGTH = 8;
const PASS_MAX_LENGTH = 64;
const PASS_ALLOWED_SPECIAL_CHARS = '@$!%*?&_';

export default {
  API_PORT: 8080,
  APP_NAME: 'Quick Bite',
  PASS_MIN_LENGTH,
  PASS_MAX_LENGTH,
  PASS_ALLOWED_SPECIAL_CHARS,
  PASS_REGEX: new RegExp(
    // eslint-disable-next-line style/max-len, regexp/prefer-w
    `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[${PASS_ALLOWED_SPECIAL_CHARS}])[A-Za-z\\d${PASS_ALLOWED_SPECIAL_CHARS}]{${PASS_MIN_LENGTH},${PASS_MAX_LENGTH}}$`
  ),
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 64,

  ROLES: {
    SUPER_ADMIN: 'super-admin',
    ADMIN: 'admin',
    RESTAURANT_OWNER: 'restaurant-owner',
    RESTAURANT_STAFF: 'restaurant-staff',
    CUSTOMER: 'customer',
    DELIVERY_PERSON: 'delivery-person',
  },

  RESOURCES: {
    USER: 'user',
    ROLE: 'role',
    PERMISSION: 'permission',
    RESTAURANT: 'restaurant',
    MENU_ITEM: 'menu-item',
    ORDER: 'order',
    REVIEW: 'review',
    DISCOUNT: 'discount',
    NOTIFICATION: 'notification',
    DELIVERY_PERSON: 'delivery-person',
  },

  ACTIONS: {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    MANAGE: 'manage',
  },

  SCOPES: {
    GLOBAL: 'global',
    OWN: 'own',
  },
};
