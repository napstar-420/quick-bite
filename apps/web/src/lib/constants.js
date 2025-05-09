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
    UPDATE_PHONE: (userId) => `user/${userId}/`,
  },
  GET_USERS: "user",
  GET_USER: (id) => `user/${id}`,
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
    MENU: (menuId) => `partner/restaurant/menus/${menuId}`,
    MENU_ITEM: (menuId, itemId) =>
      `partner/restaurant/menus/${menuId}/items/${itemId}`,
    MENU_ITEMS: (menuId) => `partner/restaurant/menus/${menuId}/items`,
    CREATE_BRANCH: "partner/restaurant/branch/new",
  },
  ADMIN: {
    RESTAURANTS: "admin/restaurants",
    RESTAURANT: (id) => `admin/restaurant/${id}`,
  },
  MENU_ITEMS: (coordinates) =>
    `menu-items/home?c=${encodeURIComponent(coordinates)}`,
  RESTAURANT_BRANCH: (id) => `restaurant/branch/${id}`,
  MENU_ITEMS_BY_IDS: (itemIds) => `menu-items/by-ids?ids=${itemIds.join(",")}`,
};
