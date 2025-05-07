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
    ADMIN_RESTAURANT: id => `/admin/restaurant/${id}`,
    RESTAURANT: id => `/restaurant/${id}`,
    CHECKOUT: "/checkout",
    ORDER_CONFIRMATION: "/order-confirmation",
  },

  PAGINATION: {
    ITEMS_PER_PAGE: 10,
  },

  MAPBOX_TOKEN,

  PLACEHOLDER_LOGO: "https://luigispizzakenosha.com/wp-content/uploads/placeholder.png",
  RESTAURANT_PLACEHOLDER_IMAGE: "https://brownbagkelowna.com/img/placeholders/burger_placeholder.png",
});
