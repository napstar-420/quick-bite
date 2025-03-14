import { API_ROUTES } from "../../lib/constants.js";
import { apiSlice } from "../../services/api.js";
import { setCredentials, logout, setUserRoles } from "./authSlice";

// TODO: Handle errors in catch blocks

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: API_ROUTES.AUTH.SIGNIN,
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data));
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: API_ROUTES.AUTH.SIGNUP,
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data));
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: API_ROUTES.AUTH.REFRESH,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ ...data, isLoading: false }));
        } catch {
          dispatch(logout());
        }
      },
    }),
    signout: builder.mutation({
      query: () => ({
        url: API_ROUTES.AUTH.SIGN_OUT,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(logout());
      },
    }),

    getUserRoles: builder.query({
      query: (userId) => ({
        url: API_ROUTES.USERS.ROLES(userId),
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUserRoles(data));
      },
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useRefreshMutation,
  useSignoutMutation,
  useGetUserRolesQuery,
} = authApiSlice;
