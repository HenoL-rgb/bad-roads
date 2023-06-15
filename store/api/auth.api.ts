import { RootState } from '../store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUser, setAuth, setUser } from '../slices/user.slice';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Login, LoginResponse } from '../../types/LoginQuery';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

const HOST_IP = '10.211.48.204:7000';
//const HOST_IP = '192.168.100.8:7000';
//const HOST_IP = '192.168.194.72:7000';

const baseQuery = fetchBaseQuery({
  baseUrl: `http://${HOST_IP}/`,
  async prepareHeaders(headers, { getState, endpoint }) {
    const userData = (getState() as RootState).userReducer;
    const token = await EncryptedStorage.getItem('token');

    if (userData.isAuth && token && endpoint !== 'auth/refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (endpoint === 'refresh') {
      const refresh = await EncryptedStorage.getItem('refresh');
      headers.set('refresh', `${refresh}`);
    }

    return headers;
  },
  credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult: QueryReturnValue<
      unknown,
      FetchBaseQueryError,
      FetchBaseQueryMeta
    > = await baseQuery('auth/refresh', api, extraOptions);
    // store the new token
    console.log('send refresh');
    
    if (refreshResult.error && refreshResult.error.status === 401) {      
      await EncryptedStorage.clear();
      api.dispatch(setAuth(false));
      return result;
    }
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
          throw new Error('Error while login');
        }
      },
    }),

    register: build.mutation<LoginResponse, Login>({
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
          console.log(error);
        }
      },
    }),

    logout: build.mutation<void, void>({
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
        } catch (error) {
          console.log(error);
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
              //routes: Route[];
              createdAt: data.user.createdAt,
              likes: data.user.likes,
              dislikes: data.user.dislikes,
              // routes: data.user.routes.map(
              //   (routeData: {
              //     id: number;
              //     createdAt: Date;
              //     isApproved: boolean;
              //     route: string;
              //   }) => ({ ...routeData, route: JSON.parse(routeData.route) }),
              // ),
            }),
          );
          dispatch(setAuth(true));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRefreshQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;
