import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<h1>Home</h1>} />
      <Route path="about" element={<h1>About</h1>} />
      <Route path="contact" element={<h1>Contact</h1>} />
    </Route>
  )
);

export default router;
