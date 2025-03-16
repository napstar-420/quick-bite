import AdminLayout from "../components/layout/admin-layout";
import AdminDashboard from "../pages/admin/dashboard";
import AdminUsers from "../pages/admin/users";
import AdminRestaurants from "../pages/admin/restaurants";
// import AdminDelivery from "../pages/admin/delivery";
// import AdminOrders from "../pages/admin/orders";
// import AdminReports from "../pages/admin/reports";
// import AdminSettings from "../pages/admin/settings";
import RoleBasedRoute from "./role-based-route";
import config from "../config";

export async function loader() { }

export default function AdminRoutes() {
  return (
    <Route
      path="admin"
      element={
        <RoleBasedRoute role={config.ROLES.ADMIN}>
          <AdminLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="restaurants" element={<AdminRestaurants />} />
      {/* <Route path="delivery" element={<AdminDelivery />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} /> */}
      <Route path="*" element={<NotFound backTo={"/admin"} />} />
    </Route>
  );
}
