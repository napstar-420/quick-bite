import PartnerDashboard from "../pages/partner/dashboard";
import PartnerMenu from "../pages/partner/menu";
import PartnerOrders from "../pages/partner/orders";
import PartnerOrderDetail from "../pages/partner/orders/detail";
import PartnerReviews from "../pages/partner/reviews";
import PartnerAnalytics from "../pages/partner/analytics";
import PartnerSettings from "../pages/partner/settings";

export default function PartnerRoutes() {
  return (
    <Route
      path="partner"
      element={
        <RoleBasedRoute role="partner">
          <PartnerLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<PartnerDashboard />} />
      <Route path="menu" element={<PartnerMenu />} />
      <Route path="orders">
        <Route index element={<PartnerOrders />} />
        <Route path=":id" element={<PartnerOrderDetail />} />
      </Route>
      <Route path="reviews" element={<PartnerReviews />} />
      <Route path="analytics" element={<PartnerAnalytics />} />
      <Route path="settings" element={<PartnerSettings />} />
    </Route>
  );
}
