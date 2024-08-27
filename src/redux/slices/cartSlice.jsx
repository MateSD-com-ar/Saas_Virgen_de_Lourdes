import { createSlice } from '@reduxjs/toolkit';

// Helper function to handle local storage operations
const updateLocalStorage = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Selector function to calculate totalQuantity and totalAmount
const calculateTotals = (items) => {
  return items.reduce(
    (totals, item) => {
      totals.quantity += item.quantity;
      totals.amount += item.price * item.quantity;
      return totals;
    },
    { quantity: 0, amount: 0 }
  );
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart(state) {
      const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      state.items = storedItems;
      const totals = calculateTotals(storedItems);
      state.totalQuantity = totals.quantity;
      state.totalAmount = totals.amount;
    },
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.quantity;
      state.totalAmount = totals.amount;

      updateLocalStorage(state.items);
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        const removedItem = state.items[itemIndex];
        if (removedItem.quantity > 1) {
          removedItem.quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }

        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.quantity;
        state.totalAmount = totals.amount;

        updateLocalStorage(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;

      updateLocalStorage(state.items);
    },
  },
});



export const { initializeCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
