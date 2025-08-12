/**
 * @copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Toxsl Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
"use client"
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const rememberSlice = createSlice({
  name: "remember",
  initialState: {
    rememberMe: Cookies.get("rememberMe") === "true",
    rememberedEmail: Cookies.get("rememberedEmail") || "",
  },
  reducers: {
    toggleRememberMe: (state) => {
      const newState = !state.rememberMe;
      Cookies.set("rememberMe", newState);
      return {
        ...state,
        rememberMe: newState,
      };
    },
    setRememberedEmail: (state, action) => {
      const { email } = action.payload;
      Cookies.set("rememberedEmail", email);
      return {
        ...state,
        rememberedEmail: email,
      };
    },
  },
});

export const { toggleRememberMe, setRememberedEmail } = rememberSlice.actions;

export default rememberSlice.reducer;