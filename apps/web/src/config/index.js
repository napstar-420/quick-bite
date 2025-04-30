import createConfig from "@quick-bite/app-config/create-config";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default createConfig({
  ROUTES: {
    HOME: "/",
    AUTH: "/auth",
    LOGOUT: "/logout",
    CART: "/cart",
    PARTNER: "/partner",
    PARTNER_NEW: "/partner/new",
    PARTNER_BRANCH_NEW: "/partner/branch/new",
    PARTNER_BRANCH: id => `/partner/branch/${id}`,

  },

  PAGINATION: {
    ITEMS_PER_PAGE: 10,
  },

  MAPBOX_TOKEN,
});
