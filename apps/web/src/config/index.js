import createConfig from "@quick-bite/app-config/create-config";

export default createConfig({
  ROUTES: {
    HOME: "/",
    AUTH: "/auth",
    LOGOUT: "/logout",
    CART: "/cart",
  },

  PAGINATION: {
    ITEMS_PER_PAGE: 10
  }
});
