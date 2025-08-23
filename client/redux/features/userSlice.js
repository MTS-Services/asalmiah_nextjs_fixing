"use client"

import Cookies from "js-cookie";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: Cookies.get("userDetail")
      ? JSON.parse(Cookies.get("userDetail"))
      : null,
    isLogin: Cookies.get("userDetail") ? true : false,
  },
  reducers: {
    userDetails: (state, action) => {
      return {
        ...state,
        data: action.payload,
        isLogin: true,
      };
    },

    logoutUser: (state, action) => {
      return {
        ...state,
        data: action.payload,
        isLogin: false,
      };
    },
  },
});

export const { userDetails, logoutUser } = userSlice.actions;
export default userSlice.reducer;
