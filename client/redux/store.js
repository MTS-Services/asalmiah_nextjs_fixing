"use client";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartSlice from "./features/cartSlice";
import productSizeColor from "./features/productSizeSlice";
import rememberSlice from "./features/rememberSlice";
import searchSlice from "./features/searchQuery";
import sliderSlice from "./features/sliderSlice";
import userSlice from "./features/userSlice";
import countrySlice  from "./features/CountrySlice";

const store = configureStore({
  reducer: {
    auth: persistReducer(
      {
        key: "user",
        storage,
      },
      userSlice
    ),
    country: persistReducer(
      {
        key: "country",
        storage,
      },
      countrySlice
    ),
    sidebar: persistReducer(
      {
        key: "sidebar",
        storage,
      },
      sliderSlice
    ),
    remember: persistReducer(
      {
        key: "remember",
        storage,
      },
      rememberSlice
    ),
    cartStore: persistReducer(
      {
        key: "cart",
        storage,
      },
      cartSlice
    ),
    searchProduct: persistReducer(
      {
        key: "search",
        storage,
      },
      searchSlice
    ),

    productData: persistReducer(
      {
        key: "product-data",
        storage,
      },
      productSizeColor
    ),
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store);

export { persistor, store };
