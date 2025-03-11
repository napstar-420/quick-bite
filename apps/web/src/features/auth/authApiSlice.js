import { apiSlice } from '../../services/api.js';
import { setCredentials, logout } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.log('Login failed:', error);
        }
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token }));
        } catch (error) {
          console.log('Refresh failed:', error);
          dispatch(logout());
        }
      },
    }),
    signout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          console.log('Logout failed:', error);
        }
      },
    }),
    checkUserExists: builder.query({
      query: (email) => ({
        url: `/auth/check-user?email=${encodeURIComponent(email)}`,
        method: 'GET',
      }),
      transformResponse: (response) => response.exists,
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useRefreshMutation,
  useSignoutMutation,
  useCheckUserExistsQuery,
} = authApiSlice;
