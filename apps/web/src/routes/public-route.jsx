import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import config from "../config";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  // If user is already authenticated and tries to access public routes like login/register
  // Redirect them to dashboard
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || config.ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
