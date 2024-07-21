import { createSlice } from '@reduxjs/toolkit';

  const initialState = {
    items: [],
  };

  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      addToCart(state, action) {
        state.items = [...state.items, action.payload];
        localStorage.setItem('cartItems', JSON.stringify(state.items));
        console.log(state);
      },
      removeFromCart(state, action) {
       state.items = state.items.filter(item => item.id !== action.payload);
      },
      clearCart(state) {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      },
    },
  })


  export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
  export default cartSlice.reducer;