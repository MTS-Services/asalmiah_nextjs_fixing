import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  size: "",
  color:""
};

export const productSizeColor = createSlice({
  name: "size-color",
  initialState,
  reducers: {
    productSize: (state, action) => {
      state.size = action.payload;
    },
    productColor: (state, action) => {
      state.color = action.payload;
    },
    productPrice: (state, action) => {
      state.price = action.payload;
    },
    productMRPPrice :(state,action) =>{
      state.mrp = action.payload;
    }
  },
});

export const { productSize,productColor,productPrice,productMRPPrice } = productSizeColor.actions;
export default productSizeColor.reducer;
