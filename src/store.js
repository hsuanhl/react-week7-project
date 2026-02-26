import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import messageSlice from './slices/messageSlice'

export const store = configureStore({
  reducer: { // 必要加入 reducer
    cart: cartSlice,
    message: messageSlice,
  }
});
