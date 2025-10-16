import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../Redux/loginSlice";


export const store = configureStore({
  reducer: {
    Login: loginSlice,
  },
})