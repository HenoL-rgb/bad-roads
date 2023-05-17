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

//const HOST_IP = "192.168.100.10:7000";
const HOST_IP = '10.211.32.66:7000';

const baseQuery = fetchBaseQuery({
  baseUrl: `http://${HOST_IP}/api`,
  async prepareHeaders(headers, { getState, endpoint }) {
    const userData = (getState() as RootState).userReducer;
    const token = await EncryptedStorage.getItem('token');

    if (userData.isAuth && token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
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
    const refreshQuery = fetchBaseQuery({
      baseUrl: `http://${HOST_IP}/auth`,
      async prepareHeaders(headers, { getState, endpoint }) {
        const userData = (getState() as RootState).userReducer;

        const token = await EncryptedStorage.getItem('refresh');

        headers.set('refresh', `${token}`);

        return headers;
      },
      credentials: 'include',
    });
    const refreshResult: any = await refreshQuery(
      `/refresh`,
      api,
      extraOptions,
    );
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

export const routesApi = createApi({
  reducerPath: 'routesApi',
  baseQuery: baseQueryWithReauth,

  endpoints: build => ({
    saveRoute: build.mutation({
      query: body => ({
        url: '/routes',
        method: 'POST',
        body,
      }),
    }),

    getAllRoutes: build.query({
      query: () => ({
        url: '/routes',
      }),
    }),

    getRoutesByUserId: build.query({
      query: (id: number) => ({
        url: `/routes/user/${id}`,
      }),
    }),

    deleteRoute: build.mutation({
      query: body => ({
        url: '/routes/delete',
        method: 'POST',
        body,
      }),
    }),

    updateRoute: build.mutation({
      query: body => ({
        url: '/routes/update',
        method: 'POST',
        body,
      }),
    }),

    approveRoute: build.mutation({
      query: body => ({
        url: '/routes/approve',
        method: 'POST',
        body,
      }),
    }),

    likeRoute: build.mutation({
      query: (id: number) => ({
        url: `/routes/like/${id}`,
        method: "POST",
        id
      })
    }),

    dislikeRoute: build.mutation({
      query: (id: number) => ({
        url: `/routes/dislike/${id}`,
        method: "POST",
        id
      })
    })
  }),
});

export const {
  useSaveRouteMutation,
  useGetAllRoutesQuery,
  useDeleteRouteMutation,
  useUpdateRouteMutation,
  useApproveRouteMutation,
  useGetRoutesByUserIdQuery,
  useLikeRouteMutation,
  useDislikeRouteMutation
} = routesApi;
