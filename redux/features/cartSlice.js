import Cookies from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: {
      cartItems: Cookies.get('cartItems')
        ? JSON.parse(Cookies.get('cartItems'))
        : [],
    },
  },

  reducers: {
    allCartItems: (state, action) => {
      const cartItems = [...state.cart.cartItems, ...action.payload?.cartItem];
      // Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    },

    addToCart: (state, action) => {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    },

    removeFromCart: (state, action) => {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    },

    clearCart: (state) => {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    },
  },
});

export const { allCartItems, addToCart, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
