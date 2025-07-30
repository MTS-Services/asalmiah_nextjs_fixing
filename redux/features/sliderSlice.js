/**
 * @copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Toxsl Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import { createSlice } from "@reduxjs/toolkit";

const sliderSlice = createSlice({
  name: "sidebar",
  initialState: {
    isSlider: false,
  },
  reducers: {
    slider: (state, action) => {
      return {
        ...state,
        isSlider: action.payload,
      };
    },
  },
});

export const { slider } = sliderSlice.actions;

export default sliderSlice.reducer;
