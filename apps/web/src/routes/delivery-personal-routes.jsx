import DeliveryDashboard from "../pages/delivery/dashboard";
import DeliveryOrders from "../pages/delivery/orders";
import DeliveryOrderDetail from "../pages/delivery/orders/detail";
import DeliveryHistory from "../pages/delivery/history";
import DeliveryEarnings from "../pages/delivery/earnings";
import DeliverySettings from "../pages/delivery/settings";


export default function DeliveryPersonalRoutes() {
  return (
    <Route
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
    </Route>
  )
}