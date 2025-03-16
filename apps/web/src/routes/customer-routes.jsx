import PrivateRoute from "./private-route";
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

export default function CustomerRoutes() {
  return (
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
  )
}