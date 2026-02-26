import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0,
  },
  reducers: {
    addCount: (state, action) => {
      state.count = state.count + action.payload;
    },
    updateCount: (state, action) => {
      state.count = action.payload;
    },
    initCount: state => {
      state.count = 0;
    },
  },
});

export default cartSlice.reducer;
export const { addCount, updateCount, initCount } = cartSlice.actions;
