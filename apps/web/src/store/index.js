import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../services/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import partnerReducer from "../features/partner/partnerSlice";
import cartReducer from "../features/cart/cartSlice";
const NODE_ENV = import.meta.env.NODE_ENV;

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    partner: partnerReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: NODE_ENV !== "production",
});

setupListeners(store.dispatch);
