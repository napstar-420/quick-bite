import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import NotFound from "../pages/not-found";
import Auth from "../pages/auth";
import Home from "../pages/home";
import { Layout as HomeLayout } from "../components/layout";
import AuthProvider from "../components/auth-provider";
import ErrorPage from "../pages/error";
import PrivateRoute from "./private-route";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<AuthProvider />}>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <h1>Hello</h1>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="auth" element={<Auth />} />
      </Route>
    </Route>,
  ),
);

export default router;
