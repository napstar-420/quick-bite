import { Header } from "../header";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
