import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurant: null,
  branches: [],
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.restaurant = action.payload;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    reset: (state) => {
      state.restaurant = null;
      state.branches = [];
    },
  },
});

export const { setRestaurant, setBranches, reset } = partnerSlice.actions;
export default partnerSlice.reducer;

export const selectRestaurant = (state) => state.partner.restaurant;
export const selectBranches = (state) => state.partner.branches;
