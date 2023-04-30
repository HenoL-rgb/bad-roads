import { createSlice } from "@reduxjs/toolkit";

interface UserData {
  isAuth: boolean;
  user:  null;
}

const initialState: UserData = {
  isAuth: false,
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth(state, action) {
      return { ...state, isAuth: action.payload };
    },

    setUser(state, action) {
      return { ...state, user: action.payload };
    },

    clearUser() {
      return { ...initialState };
    },
  },
});

export const { setUser, setAuth, clearUser } = userSlice.actions;

export default userSlice.reducer;
