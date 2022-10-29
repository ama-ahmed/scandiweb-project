import { createSlice } from "@reduxjs/toolkit";

const initialState = { currentCurrency: "$", products: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCurrency(state, action) {
      state.currentCurrency = action.payload;
    },
    addToCart(state, action) {
      state.products = action.payload;
    },
  },
});

export const { setCurrency, addToCart } = cartSlice.actions;

export default cartSlice.reducer
