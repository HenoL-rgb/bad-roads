import { createSlice } from '@reduxjs/toolkit';
import { Route } from '../../types/Route';

export interface UserData {
  isAuth: boolean;
  user: User | null;
}

export interface User {
  email: string;
  id: number;
  banned: boolean;
  banReason: string;
  roles: {
    value: string,
    description: string,
  }[];
  //routes: Route[];
  createdAt?: Date;
}

const initialState: UserData = {
  isAuth: false,
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
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
