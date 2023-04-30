import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/auth.api'
import userReducer from "./slices/user.slice"
// ...

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware)
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch