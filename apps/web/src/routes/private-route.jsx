import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsLoading,
} from "../features/auth/authSlice";
import config from "../config";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  if (isLoading) {
    // TODO: Show loading spinner
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return (
      <Navigate
        to={config.ROUTES.AUTH}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
