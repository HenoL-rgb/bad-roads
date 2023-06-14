import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
    setAuth(state, action: PayloadAction<boolean | null>) {
      state.isAuth = action.payload;
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    clearUser() {
      return { ...initialState };
    },

    setUserLike(state, action) {      
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

    setUserDislike(state, action) {      
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

export const { setUser, setAuth, clearUser, setUserLike, setUserDislike } = userSlice.actions;

export default userSlice.reducer;
