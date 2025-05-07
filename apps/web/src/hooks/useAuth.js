import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectUserRoles,
} from "../features/auth/authSlice";

/**
 * Custom hook to access authentication state from Redux
 * @returns {Object} Authentication state and helper functions
 */
export const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const userRoles = useSelector(selectUserRoles);

  const hasRole = (role) => {
    return userRoles.some((userRole) => userRole.name === role);
  };

  /**
   * Check if the user has a specific permission
   * @param {string} resource - The resource being accessed
   * @param {string} action - The action being performed
   * @returns {boolean} Whether the user has the permission
   */
  const hasPermission = (resource, action) => {
    if (!user || !userRoles.length) return false;

    return userRoles.some((role) =>
      role.permissions.some(
        (permission) =>
          (permission.resource === resource && permission.action === action) ||
          (permission.resource === resource &&
            permission.action === "manage") ||
          (permission.resource === "*" && permission.action === "*"),
      ),
    );
  };

  /**
   * Check if the user has permission to access a specific resource instance
   * @param {string} resource - The resource being accessed
   * @param {string} action - The action being performed
   * @param {Object} resourceInstance - The specific resource instance
   * @param {string} ownerField - The field that identifies the owner (default: 'userId')
   * @returns {boolean} Whether the user has permission for this resource instance
   */
  const hasResourcePermission = (
    resource,
    action,
    resourceInstance,
    ownerField = "userId",
  ) => {
    if (!user || !resourceInstance) return false;

    // Check if user has global permission for this resource type
    const hasGlobalPermission = userRoles.some((role) =>
      role.permissions.some(
        (permission) =>
          (permission.resource === resource &&
            permission.action === "manage") ||
          (permission.resource === "*" && permission.action === "*"),
      ),
    );

    // If user has global permission, they can access any instance
    if (hasGlobalPermission) return true;

    // Check if user has the specific action permission
    const hasActionPermission = hasPermission(resource, action);

    // If user doesn't have the action permission, they can't access
    if (!hasActionPermission) return false;

    // Check if user owns this resource
    const isOwner = resourceInstance[ownerField] === user.id;

    // User can access if they own the resource
    return isOwner;
  };

  return {
    isAuthenticated,
    user,
    hasPermission,
    hasRole,
    hasResourcePermission,
    isLoading: false,
  };
};
