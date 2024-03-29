import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import EncryptedStorage from 'react-native-encrypted-storage';

import { IError } from '../../navigation/AppWrapper';
import { LoginResponse, Login, Register } from '../../types/LoginQuery';
import { Logout } from '../../types/Logout';
import { RegisterDevice } from '../../types/RegisterDevice';
import { clearUser, setAuth, setUser } from '../slices/user.slice';
import { RootState } from '../store';

export const HOST_IP = '192.168.100:7000';

const baseQuery = fetchBaseQuery({
  baseUrl: `http://${HOST_IP}/`,
  async prepareHeaders(headers, { getState, endpoint }) {
    const userData = (getState() as RootState).userReducer;
    const token = await EncryptedStorage.getItem('token');

    if (userData.isAuth && token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (endpoint === 'refresh') {
      const refresh = await EncryptedStorage.getItem('refresh');

      headers.set('refresh', `${refresh}`);
    }

    return headers;
  },
  credentials: 'include',
}) as BaseQueryFn<string | FetchArgs, unknown, IError>;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  IError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult: QueryReturnValue<unknown, IError> = await baseQuery(
      { url: 'auth/refresh' },
      { ...api, endpoint: 'refresh' },
      extraOptions,
    );
    // store the new token
    if (refreshResult.error) {
      if (refreshResult.error.status === 401) {
        await EncryptedStorage.clear();
        api.dispatch(setAuth(false));
        return result;
      } else {
        throw new Error(refreshResult.error.data.message);
      }
    }

    const data = refreshResult.data as {
      accessToken: string;
      refreshToken: string;
    };

    await EncryptedStorage.setItem('token', data.accessToken);
    await EncryptedStorage.setItem('refresh', data.refreshToken);
    // retry the initial query
    result = await baseQuery(args, api, extraOptions);
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,

  endpoints: build => ({
    login: build.mutation<LoginResponse, Login>({
      query: body => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          await EncryptedStorage.setItem('token', data.accessToken);
          await EncryptedStorage.setItem('refresh', data.refreshToken);

          dispatch(
            setUser({
              id: data.user.id,
              email: data.user.email,
              banned: data.user.banned,
              banReason: data.user.banReason,
              roles: data.user.roles,
              createdAt: data.user.createdAt,
              likes: data.user.likes,
              dislikes: data.user.dislikes,
            }),
          );
          dispatch(setAuth(true));
        } catch (error) {
          dispatch(setAuth(false));
        }
      },
    }),

    register: build.mutation<LoginResponse, Register>({
      query: body => ({
        url: 'auth/registration',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await EncryptedStorage.setItem('token', data.accessToken);
          await EncryptedStorage.setItem('refresh', data.refreshToken);
          dispatch(
            setUser({
              id: data.user.id,
              email: data.user.email,
              banned: data.user.banned,
              banReason: data.user.banReason,
              roles: data.user.roles,
              createdAt: data.user.createdAt,
              likes: data.user.likes,
              dislikes: data.user.dislikes,
            }),
          );
          dispatch(setAuth(true));
        } catch (error) {
          dispatch(setAuth(false));
        }
      },
    }),

    logout: build.mutation<void, Logout>({
      query: body => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await EncryptedStorage.clear();
          dispatch(clearUser());
          dispatch(setAuth(false));
        } catch (error) {
          throw Error(`${error}`);
        }
      },
    }),

    refresh: build.query({
      query: () => ({
        url: 'auth/refresh',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          await EncryptedStorage.setItem('token', data.accessToken);
          await EncryptedStorage.setItem('refresh', data.refreshToken);
          dispatch(
            setUser({
              id: data.user.id,
              email: data.user.email,
              banned: data.user.banned,
              banReason: data.user.banReason,
              roles: data.user.roles,
              createdAt: data.user.createdAt,
              likes: data.user.likes,
              dislikes: data.user.dislikes,
            }),
          );
          dispatch(setAuth(true));
        } catch (error) {
          throw Error(`${error}`);
        }
      },
    }),

    registerDevice: build.mutation<void, RegisterDevice>({
      query: body => ({
        url: 'api/notifications',
        method: 'POST',
        body,
      }),
    }),

    unregisterDevice: build.mutation<void, RegisterDevice>({
      query: body => ({
        url: '/unregister',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useRefreshQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRegisterDeviceMutation,
  useUnregisterDeviceMutation,
} = authApi;
