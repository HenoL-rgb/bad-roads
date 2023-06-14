import { RootState } from '../store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAuth } from '../slices/user.slice';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { HOST_IP_INNO } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SaveRoute, SaveRouteResponse } from '../../types/SaveRouteQuery';
import { Route } from '../../types/Route';
import { DeleteRoute, DeleteRouteResponse, GetRouteByIdResponse, GetRoutesResponse } from '../../types/GetAllRoutesQuery';
import { baseQueryWithReauth } from './auth.api';
import { UpdateRoute, UpdateRouteResponse } from '../../types/UpdateRouteQuery';
import { ApproveRoute, ApproveRouteResponse } from '../../types/ApproveRouteQuery';
import { MarkRoute, MarkRouteResponse } from '../../types/MarksQuery';

//const HOST_IP = '192.168.194.72:7000';
//const HOST_IP = "192.168.100.8:7000";
const HOST_IP = '10.211.32.160:7000';

export const routesApi = createApi({
  reducerPath: 'routesApi',
  baseQuery: baseQueryWithReauth,

  endpoints: build => ({
    saveRoute: build.mutation<SaveRouteResponse, SaveRoute>({
      query: body => ({
        url: 'api/routes',
        method: 'POST',
        body,
      }),
    }),

    getAllRoutes: build.query<GetRoutesResponse[], object>({
      query: () => ({
        url: 'api/routes',
      }),
    }),

    getRouteById: build.query<GetRouteByIdResponse, number>({
      query: (id: number) => ({
        url: `api/routes/${id}`
      })
    }),

    getRoutesByUserId: build.query<GetRoutesResponse[],number>({
      query: (id: number) => ({
        url: `api/routes/user/${id}`,
      }),
    }),

    deleteRoute: build.mutation<DeleteRouteResponse, DeleteRoute>({
      query: body => ({
        url: 'api/routes/delete',
        method: 'POST',
        body,
      }),
    }),

    updateRoute: build.mutation<UpdateRouteResponse, UpdateRoute>({
      query: body => ({
        url: 'api/routes/update',
        method: 'POST',
        body,
      }),
    }),

    approveRoute: build.mutation<ApproveRouteResponse, ApproveRoute>({
      query: body => ({
        url: 'api/routes/approve',
        method: 'POST',
        body,
      }),
    }),

    likeRoute: build.mutation<MarkRouteResponse, MarkRoute>({
      query: (body) => ({
        url: `api/routes/likes`,
        method: "POST",
        body
      })
    }),

    // getLikedByUserId: build.query({
    //   query: (id: number) => ({
    //     url: `api/routes/likes/user/${id}`
    //   })
    // }),

    dislikeRoute: build.mutation<MarkRouteResponse, MarkRoute>({
      query: (body) => ({
        url: `api/routes/dislikes`,
        method: "POST",
        body
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
  useDislikeRouteMutation,
  useGetRouteByIdQuery,
  //useGetLikedByUserIdQuery
} = routesApi;
