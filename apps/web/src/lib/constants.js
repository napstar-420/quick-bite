export const API_ROUTES = {
  BASE_URL: "/api",
  AUTH: {
    SIGNIN: "auth/signin",
    SIGNUP: "auth/signup",
    SIGN_OUT: "auth/signout",
    REFRESH: "/auth/refresh",
    CHECK_USER: "auth/check-user",
  },
  USERS: {
    ROLES: (userId) => `user/${userId}/roles`,
  },
  GET_USERS: "user",
  CATEGORIES: {
    SEARCH: "category/search",
  },
  RESTAURANTS: {
    CREATE: "restaurant",
  },
  PARTNER: {
    RESTAURANT: "partner/restaurant",
    BRANCHES: "partner/branches",
    MENUS: "partner/restaurant/menus",
    MENU_ITEMS: "partner/menu-items",
  },
};
