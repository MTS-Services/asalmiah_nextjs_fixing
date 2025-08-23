import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
 
};

export const searchSlice = createSlice({
  name: "search_slice",
  initialState,
  reducers: {
    searchQuery: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { searchQuery } = searchSlice.actions;
export default searchSlice.reducer;
