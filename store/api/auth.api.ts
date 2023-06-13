import { RootState } from '../store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUser, setAuth, setUser } from '../slices/user.slice';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { HOST_IP_INNO } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';

const HOST_IP = '10.211.32.139:7000';
//const HOST_IP = '192.168.100.11:7000';
//const HOST_IP = '192.168.194.72:7000';

const baseQuery = fetchBaseQuery({
  baseUrl: `http://${HOST_IP}/auth`,
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
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult: any = await baseQuery('/refresh', api, extraOptions);
    // store the new token    
    
    if (refreshResult.error && result.error.status === 401) {
      await EncryptedStorage.clear();
      api.dispatch(setAuth(false));
      return result;
    }

    if (!refreshResult.error) {
      //localStorage.setItem("token", refreshResult.data?.accessToken);

      await EncryptedStorage.setItem('token', refreshResult.data.accessToken);
      await EncryptedStorage.setItem(
        'refresh',
        refreshResult.data.refreshToken,
      );
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,

  endpoints: build => ({
    login: build.mutation({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.message) {
            throw new Error(data.message);
          }

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
          dispatch(setAuth(false))
          throw new Error('Error while login');
        }
      },
    }),

    register: build.mutation({
      query: body => ({
        url: '/registration',
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
          dispatch(setAuth(false))
          console.log(error);
        }
      },
    }),

    logout: build.mutation({
      query: body => ({
        url: '/logout',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await EncryptedStorage.clear();
          dispatch(clearUser());
        } catch (error) {
          console.log(error);
        }
      },
    }),

    refresh: build.query({
      query: () => ({
        url: '/refresh',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data.message) {
            dispatch(setAuth(false));
            throw new Error(data.message);
          }
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
