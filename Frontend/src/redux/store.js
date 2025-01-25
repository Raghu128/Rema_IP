import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // User slice for authentication
  },
});

export default store;
