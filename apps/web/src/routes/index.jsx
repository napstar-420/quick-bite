import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from "react-router-dom";
import NotFound from "../pages/not-found";
import Auth from "../pages/auth";
import Home from "../pages/home";
import HomeLayout from "../components/layout/home-layout";
import RootLayout from "../components/layout/root-layout";
import AdminLayout from "../components/layout/admin-layout";
import AdminDashboard from "../pages/admin/dashboard";
import AdminUsers from "../pages/admin/users";
import AdminRestaurants from "../pages/admin/restaurants";
// import { Layout as DashboardLayout } from "../components/layout/dashboard-layout";
// import { Layout as PartnerLayout } from "../components/layout/partner-layout";
// import { Layout as DeliveryLayout } from "../components/layout/delivery-layout";
import AuthProvider from "../components/auth-provider";
import ErrorPage from "../pages/error";
import PrivateRoute from "./private-route";
import RoleBasedRoute from "./role-based-route.jsx";
import PublicRoute from "./public-route";
// import AdminRoutes from "./admin-routes";
import Unauthorized from "../pages/unauthorized";
import Suspended from "../pages/suspended";
import config from "../config";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<AuthProvider />}>
        <Route element={<RootLayout />}>
          {/* Public Routes */}
          <Route element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Unauthorized Routes */}
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Suspended Routes */}
          <Route path="suspended" element={<Suspended />} />

          {/* Private Routes */}
          <Route
            path="admin"
            element={
              <PrivateRoute>
                <RoleBasedRoute role={config.ROLES.ADMIN}>
                  <AdminLayout />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="*" element={<NotFound backTo={"/admin"} />} />
          </Route>

          {/* Auth Routes */}
          <Route
            path="auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
