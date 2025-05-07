const express = require('express');

const router = express.Router();

const roleController = require('../controllers/role.controller');
const authorize = require('../middlewares/authorize.middleware');
const handleValidationErrors = require('../middlewares/validation-error.middleware');
const {
  createRoleValidation,
  updateRoleValidation,
  createPermissionValidation,
  assignRolesValidation,
  removeRolesValidation,
} = require('../middlewares/validations.middleware');
const verifyJwt = require('../middlewares/verify-jwt.middleware');

// All routes require authentication
router.use(verifyJwt);

// Role routes
router.get('/', authorize('role', 'read'), roleController.getAllRoles);

router.get('/:id', authorize('role', 'read'), roleController.getRoleById);

router.post(
  '/',
  authorize('role', 'create'),
  createRoleValidation,
  handleValidationErrors,
  roleController.createNewRole,
);

router.put(
  '/:id',
  authorize('role', 'update'),
  updateRoleValidation,
  handleValidationErrors,
  roleController.updateRole,
);

router.delete('/:id', authorize('role', 'delete'), roleController.deleteRole);

// Permission routes
router.get(
  '/permissions',
  authorize('permission', 'read'),
  roleController.getAllPermissions,
);

router.post(
  '/permissions',
  authorize('permission', 'create'),
  createPermissionValidation,
  handleValidationErrors,
  roleController.createNewPermission,
);

// User role assignment routes
router.post(
  '/assign',
  authorize('role', 'update'),
  assignRolesValidation,
  handleValidationErrors,
  roleController.assignRoles,
);

router.post(
  '/remove',
  authorize('role', 'update'),
  removeRolesValidation,
  handleValidationErrors,
  roleController.removeRoles,
);

module.exports = router;
