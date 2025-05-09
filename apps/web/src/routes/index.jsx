import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from "react-router-dom";
import Home from "../pages/home";
import Restaurant from "../pages/restaurant";
// Auth Pages
import Auth from "../pages/auth";
import Logout from "../pages/auth/logout";

// Layout Components
import HomeLayout from "../components/layout/home-layout";
import RootLayout from "../components/layout/root-layout";
import AdminLayout from "../components/layout/admin-layout";

// Admin Pages
import AdminDashboard from "../pages/admin/dashboard";
import AdminUsers from "../pages/admin/users";
import AdminRestaurants from "../pages/admin/restaurants";
import ManageRestaurant from "../pages/admin/manage-restaurant.jsx";

// Auth Components
import AuthProvider from "../components/auth-provider";
import RoleBasedRoute from "./role-based-route.jsx";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import NotFound from "../pages/not-found";
import ErrorPage from "../pages/error";
import Unauthorized from "../pages/Unauthorized.jsx";
import Suspended from "../pages/Suspended.jsx";

// Partner Pages
import PartnerNew from "../pages/partner/new";
import { PartnerRoutes } from "./partner-routes";

// Config
import config from "../config";
import CartPage from "../pages/cart.jsx";
import CheckoutPage from "../pages/checkout.jsx";
import OrderConfirmationPage from "../pages/order-confirmation.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<AuthProvider />}>
        <Route element={<RootLayout />}>
          {/* Customer Routes */}
          <Route element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="restaurant/:id" element={<Restaurant />} />
            <Route path="cart" element={<CartPage />} />

            <Route
              path="checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="order-confirmation"
              element={
                <PrivateRoute>
                  <OrderConfirmationPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Unauthorized Routes */}
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Suspended Routes */}
          <Route path="suspended" element={<Suspended />} />

          {/* Auth Routes */}
          <Route
            path="auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />

          <Route path="logout" element={<Logout />} />

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
            <Route path="restaurant/:id" element={<ManageRestaurant />} />
            <Route path="*" element={<NotFound backTo={"/admin"} />} />
          </Route>

          {/* Partner Routes */}
          <Route
            path="partner/new"
            element={
              <PrivateRoute>
                <PartnerNew />
              </PrivateRoute>
            }
          />
          {PartnerRoutes}
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
