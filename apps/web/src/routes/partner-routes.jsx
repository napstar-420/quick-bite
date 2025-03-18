import { Route } from "react-router-dom";
import PartnerLayout from "../components/layout/partner-layout";
import PartnerDashboard from "../pages/partner/dashboard";
import NotFound from "../pages/not-found";
import PartnerMenu from "../pages/partner/menu";
import PrivateRoute from "./private-route";
import PartnerProvider from "../components/partner-provider";
// import PartnerOrders from "../pages/partner/orders";
// import PartnerOrderDetail from "../pages/partner/orders/detail";
// import PartnerReviews from "../pages/partner/reviews";
// import PartnerAnalytics from "../pages/partner/analytics";
// import PartnerSettings from "../pages/partner/settings";

export const PartnerRoutes = (
  <Route
    element={
      <PrivateRoute>
        <PartnerProvider></PartnerProvider>
      </PrivateRoute>
    }
  >
    <Route path="partner" element={<PartnerLayout />}>
      <Route path="dashboard" element={<PartnerDashboard />} />
      <Route path="menu" element={<PartnerMenu />} />
      {/* <Route path="orders">
        <Route index element={<PartnerOrders />} />
        <Route path=":id" element={<PartnerOrderDetail />} />
      </Route>
      <Route path="reviews" element={<PartnerReviews />} />
      <Route path="analytics" element={<PartnerAnalytics />} />
      <Route path="settings" element={<PartnerSettings />} /> */}
      <Route path="*" element={<NotFound backTo="/partner/dashboard" />} />
    </Route>
  </Route>
);
