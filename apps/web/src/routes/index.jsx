import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import NotFound from "../pages/not-found";
import Auth from "../pages/auth";
import Home from "../pages/home";
import { Layout as HomeLayout } from "../components/layout/home-layout";
import { Layout as RootLayout } from "../components/layout/root-layout";
import AuthProvider from "../components/auth-provider";
import ErrorPage from "../pages/error";
import PrivateRoute from "./private-route";
import AccountPage from "../pages/account";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<AuthProvider />}>
        <Route element={<RootLayout />}>
          <Route element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route
              path="account"
              element={
                <PrivateRoute>
                  <AccountPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="auth" element={<Auth />} />
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
