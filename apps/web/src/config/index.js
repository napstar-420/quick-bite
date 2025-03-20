import createConfig from "@quick-bite/app-config/create-config";

export default createConfig({
  ROUTES: {
    HOME: "/",
    AUTH: "/auth",
    LOGOUT: "/logout",
    CART: "/cart",
    PARTNER: "/partner",
    PARTNER_NEW: "/partner/new"
  },

  PAGINATION: {
    ITEMS_PER_PAGE: 10,
  },
});
