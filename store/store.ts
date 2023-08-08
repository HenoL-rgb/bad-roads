import { combineReducers, configureStore } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { authApi } from './api/auth.api';
import { routesApi } from './api/routes.api';
import mapReducer from './slices/map.slice';
import routesReducer from './slices/routes.slice';
import themeReducer from './slices/theme.slice';
import userReducer from './slices/user.slice';
// ...
const persistConfig = {
  key: 'root',
  storage: EncryptedStorage,
};

const rootReducer = combineReducers({
  userReducer,
  themeReducer,
  routesReducer,
  mapReducer,
  [routesApi.reducerPath]: routesApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(routesApi.middleware, authApi.middleware);
  },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
