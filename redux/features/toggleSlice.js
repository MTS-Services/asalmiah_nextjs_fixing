const { createSlice } = require("@reduxjs/toolkit");

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    toggle: false,
  },
  reducers: {
    setToggle: (state) => {
      state.toggle = !state.toggle;
    },
  },
});

export const { setToggle } = toggleSlice.actions;
export default toggleSlice.reducer;
