import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from "react-router-dom";
import NotFound from "../pages/not-found";
import Auth from "../pages/auth";
import Home from "../pages/home";
import { Layout as HomeLayout } from "../components/layout/home-layout";
import { Layout as RootLayout } from "../components/layout/root-layout";
// import { Layout as DashboardLayout } from "../components/layout/dashboard-layout";
// import { Layout as RestaurantLayout } from "../components/layout/restaurant-layout";
// import { Layout as DeliveryLayout } from "../components/layout/delivery-layout";
import { Layout as AdminLayout } from "../components/layout/admin-layout";
import AuthProvider from "../components/auth-provider";
import ErrorPage from "../pages/error";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
// import RoleBasedRoute from "./role-based-route";

// Customer Pages
import AccountPage from "../pages/account";
// import RestaurantListPage from "../pages/restaurants/list";
// import RestaurantDetailPage from "../pages/restaurants/detail";
// import CartPage from "../pages/cart";
// import CheckoutPage from "../pages/checkout";
// import OrdersPage from "../pages/orders";
// import OrderDetailPage from "../pages/orders/detail";
// import TrackOrderPage from "../pages/orders/track";
// import FavoritesPage from "../pages/favorites";
// import ReviewsPage from "../pages/reviews";
// import LoyaltyPage from "../pages/loyalty";
// import ProfilePage from "../pages/profile";

// Restaurant Pages
// import RestaurantDashboard from "../pages/restaurant/dashboard";
// import RestaurantMenu from "../pages/restaurant/menu";
// import RestaurantOrders from "../pages/restaurant/orders";
// import RestaurantOrderDetail from "../pages/restaurant/orders/detail";
// import RestaurantReviews from "../pages/restaurant/reviews";
// import RestaurantAnalytics from "../pages/restaurant/analytics";
// import RestaurantSettings from "../pages/restaurant/settings";

// Delivery Personnel Pages
// import DeliveryDashboard from "../pages/delivery/dashboard";
// import DeliveryOrders from "../pages/delivery/orders";
// import DeliveryOrderDetail from "../pages/delivery/orders/detail";
// import DeliveryHistory from "../pages/delivery/history";
// import DeliveryEarnings from "../pages/delivery/earnings";
// import DeliverySettings from "../pages/delivery/settings";

// Admin Pages
import AdminDashboard from "../pages/admin/dashboard";
// import AdminUsers from "../pages/admin/users";
// import AdminRestaurants from "../pages/admin/restaurants";
// import AdminDelivery from "../pages/admin/delivery";
// import AdminOrders from "../pages/admin/orders";
// import AdminReports from "../pages/admin/reports";
// import AdminSettings from "../pages/admin/settings";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<AuthProvider />}>
        <Route element={<RootLayout />}>
          {/* Public Routes */}
          <Route element={<HomeLayout />}>
            <Route index element={<Home />} />
            {/* <Route path="restaurants">
              <Route index element={<RestaurantListPage />} />
              <Route path=":id" element={<RestaurantDetailPage />} />
            </Route> */}
            <Route path="*" element={<NotFound />} />
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

          {/* Customer Routes */}
          <Route
            path="account"
            element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }
          >
            <Route index element={<AccountPage />} />
            {/* <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders">
              <Route index element={<OrdersPage />} />
              <Route path=":id" element={<OrderDetailPage />} />
              <Route path=":id/track" element={<TrackOrderPage />} />
            </Route>
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />
            <Route path="profile" element={<ProfilePage />} /> */}
          </Route>

          {/* Restaurant Routes */}
          {/* <Route
            path="restaurant"
            element={
              <RoleBasedRoute role="restaurant">
                <RestaurantLayout />
              </RoleBasedRoute>
            }
          >
            <Route index element={<RestaurantDashboard />} />
            <Route path="menu" element={<RestaurantMenu />} />
            <Route path="orders">
              <Route index element={<RestaurantOrders />} />
              <Route path=":id" element={<RestaurantOrderDetail />} />
            </Route>
            <Route path="reviews" element={<RestaurantReviews />} />
            <Route path="analytics" element={<RestaurantAnalytics />} />
            <Route path="settings" element={<RestaurantSettings />} />
          </Route> */}

          {/* Delivery Personnel Routes */}
          {/* <Route
            path="delivery"
            element={
              <RoleBasedRoute role="delivery">
                <DeliveryLayout />
              </RoleBasedRoute>
            }
          >
            <Route index element={<DeliveryDashboard />} />
            <Route path="orders">
              <Route index element={<DeliveryOrders />} />
              <Route path=":id" element={<DeliveryOrderDetail />} />
            </Route>
            <Route path="history" element={<DeliveryHistory />} />
            <Route path="earnings" element={<DeliveryEarnings />} />
            <Route path="settings" element={<DeliverySettings />} />
          </Route> */}

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <AdminLayout />
              // <RoleBasedRoute role="admin">
              // </RoleBasedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            {/* <Route path="users" element={<AdminUsers />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} /> */}
            <Route path="*" element={<NotFound backTo={'/admin'} />} />
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
