const { createSlice } = require("@reduxjs/toolkit");

const profileDetailSlice = createSlice({
  name: "PROFILE",
  initialState: {
    data: null,
  },
  reducers: {
    getProfile: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
});

export const { getProfile } = profileDetailSlice.actions;
export default profileDetailSlice.reducer;
