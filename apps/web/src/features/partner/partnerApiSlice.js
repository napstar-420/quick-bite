import { API_ROUTES } from "../../lib/constants.js";
import { apiSlice } from "../../services/api.js";
import { setRestaurant, setBranches } from "./partnerSlice.js";

export const partnerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurant: builder.query({
      query: () => ({
        url: API_ROUTES.PARTNER.RESTAURANT,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setRestaurant(data));
      },
    }),
    getBranches: builder.query({
      query: () => ({
        url: API_ROUTES.PARTNER.BRANCHES,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setBranches(data));
      },
    }),
  }),
});

export const { useGetRestaurantQuery, useGetBranchesQuery } = partnerApiSlice;
