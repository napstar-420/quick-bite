import { Toaster } from "../../components/ui/sonner";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
}
