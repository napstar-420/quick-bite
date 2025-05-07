import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

/**
 * A wrapper component for permission-based route protection that works with Redux
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.resource - The resource being accessed
 * @param {string} props.action - The action being performed (create, read, update, delete, manage)
 * @param {string} [props.redirectTo] - Path to redirect to if unauthorized (defaults to /auth)
 * @returns {React.ReactNode} The protected route component
 */
export default function PermissionBasedRoute({
  children,
  resource,
  action,
  redirectTo = "/auth",
}) {
  const { user, isAuthenticated, hasPermission, isLoading } = useAuth();
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

  // Check if user has required permission
  if (!hasPermission(resource, action)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected route
  return children;
}

PermissionBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  resource: PropTypes.string.isRequired,
  action: PropTypes.oneOf(["create", "read", "update", "delete", "manage"])
    .isRequired,
  redirectTo: PropTypes.string,
};
