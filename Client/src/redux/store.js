import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    user: userReducer, 
    theme: themeReducer// User slice for authentication
  },
});

export default store;
