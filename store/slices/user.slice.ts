import { createSlice } from '@reduxjs/toolkit';
import { Route } from '../../types/Route';

export interface UserData {
  isAuth: boolean | null;
  user: User | null;
}

export interface User {
  email: string;
  id: number;
  banned: boolean;
  banReason: string;
  roles: {
    value: string;
    description: string;
  }[];
  likes: {
    id: number;
  }[];
  dislikes: {
    id: number;
  }[];
  routes: Route[];
  createdAt?: Date;
}

const initialState: UserData = {
  isAuth: null,
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

    setLike(state, action) {      
      if (state.user?.likes.some(item => item.id === action.payload.id)) {
        state.user.likes = state.user.likes.filter(
          item => item.id !== action.payload.id,
        );
      } else {
        if(state.user?.dislikes)
          state.user.dislikes = state.user?.dislikes.filter(item => item.id !== action.payload.id)
        state.user?.likes.push(action.payload);
      }
    },

    setDislike(state, action) {      
      if (state.user?.dislikes.some(item => item.id === action.payload.id)) {
        state.user.dislikes = state.user.dislikes.filter(
          item => item.id !== action.payload.id,
        );
      } else {
        if(state.user?.likes)
          state.user.likes = state.user?.likes.filter(item => item.id !== action.payload.id)
        state.user?.dislikes.push(action.payload);
      }
    },

  },
});

export const { setUser, setAuth, clearUser, setLike, setDislike } = userSlice.actions;

export default userSlice.reducer;
