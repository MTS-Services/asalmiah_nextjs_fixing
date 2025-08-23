import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  country: "Kuwait",
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    country: (state, action) => {
      state.country = action.payload;
    },
  },
});

export const { country } = countrySlice.actions;
export default countrySlice.reducer;
