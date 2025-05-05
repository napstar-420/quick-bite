import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  userRoles: [],
  coordinates: localStorage.getItem("coordinates") || null,
  city: localStorage.getItem("city") || 'lahore',
  isLocationEnabled:
    localStorage.getItem("isLocationEnabled") === "true" ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, isLoading } = action.payload;

      // Only update what's provided in the payload
      if (user) state.user = user;
      if (token) state.token = token;
      if (typeof isLoading === "boolean") state.isLoading = isLoading;
      // If either is updated, user is authenticated
      if (user || token) {
        state.isAuthenticated = true;
      }
    },
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
      localStorage.setItem("coordinates", action.payload);
    },
    setCity: (state, action) => {
      state.city = action.payload;
      localStorage.setItem("city", action.payload);
    },
    setIsLocationEnabled: (state, action) => {
      state.isLocationEnabled = action.payload;
      localStorage.setItem("isLocationEnabled", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.userRoles = [];
    },
  },
});

export const {
  setCredentials,
  logout,
  setUserRoles,
  setCoordinates,
  setCity,
  setIsLocationEnabled,
} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectUserRoles = (state) => state.auth.userRoles;
export const selectCoordinates = (state) => state.auth.coordinates;
export const selectCity = (state) => state.auth.city;
export const selectIsLocationEnabled = (state) => state.auth.isLocationEnabled;
