import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

/**
 * A wrapper component for resource-based route protection that checks ownership
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.resource - The resource being accessed
 * @param {string} props.action - The action being performed (create, read, update, delete, manage)
 * @param {Object} props.resourceInstance - The specific resource instance being accessed
 * @param {string} [props.ownerField] - The field that identifies the owner (default: 'userId')
 * @param {string} [props.redirectTo] - Path to redirect to if unauthorized (defaults to /auth)
 * @returns {React.ReactNode} The protected route component
 */
const ResourceBasedRoute = ({
  children,
  resource,
  action,
  resourceInstance,
  ownerField = "userId",
  redirectTo = "/auth",
}) => {
  const { user, isAuthenticated, hasResourcePermission, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary">
          Loading...
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user is suspended
  if (user?.suspended) {
    return <Navigate to="/suspended" replace />;
  }

  // Check if user has permission for this specific resource instance
  if (!hasResourcePermission(resource, action, resourceInstance, ownerField)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected route
  return children;
};

ResourceBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  resource: PropTypes.string.isRequired,
  action: PropTypes.oneOf(["create", "read", "update", "delete", "manage"])
    .isRequired,
  resourceInstance: PropTypes.object.isRequired,
  ownerField: PropTypes.string,
  redirectTo: PropTypes.string,
};

export default ResourceBasedRoute;
