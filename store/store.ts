import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/auth.api'
import { routesApi } from './api/routes.api'
import userReducer from "./slices/user.slice"
import themeReducer from './slices/theme.slice'
import routesReducer from './slices/routes.slice'
// ...

export const store = configureStore({
  reducer: {
    [routesApi.reducerPath]: routesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    userReducer,
    themeReducer,
    routesReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(routesApi.middleware, authApi.middleware)
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch