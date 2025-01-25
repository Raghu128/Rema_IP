import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,  // Stores user details if logged in
  isLoggedIn: false, // Tracks login status
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {

      state.user = action.payload.user;
      state.isLoggedIn = true;
    
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
