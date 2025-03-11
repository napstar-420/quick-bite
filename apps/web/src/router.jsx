import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";
import NotFound from "./pages/not-found";
import Auth from "./pages/auth";
import Home from "./pages/home";
import { Layout as HomeLayout } from "./components/layout";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="auth" element={<Auth />} />
    </Route>
  )
);

export default router;
