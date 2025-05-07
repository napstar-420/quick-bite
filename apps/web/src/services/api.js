// RTK Query API configuration
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/auth/authSlice";
import { API_ROUTES } from "../lib/constants";

// Base query with token handling
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include", // Needed for cookies to be sent with requests
  prepareHeaders: (headers, { getState }) => {
    // Get token from state
    const token = getState().auth.token;

    // Add authorization header if token exists
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper for baseQuery that handles token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Try the initial query
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized, try to get a new token
  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      API_ROUTES.AUTH.REFRESH,
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      // Store the new token
      api.dispatch(setCredentials({ token: refreshResult.data.token }));

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh fails, log the user out
      api.dispatch(logout());
    }
  }

  return result;
};

// Create API slice with reauth
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
