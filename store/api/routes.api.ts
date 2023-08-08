import { createApi } from '@reduxjs/toolkit/query/react';

import {
  ApproveRoute,
  ApproveRouteResponse,
} from '../../types/ApproveRouteQuery';
import {
  DeleteRoute,
  DeleteRouteResponse,
  GetRouteByIdResponse,
  GetRoutesResponse,
} from '../../types/GetAllRoutesQuery';
import { MarkRoute, MarkRouteResponse } from '../../types/MarksQuery';
import {
  Obstacle,
  SaveRoute,
  SaveRouteResponse,
} from '../../types/SaveRouteQuery';
import { UpdateRoute, UpdateRouteResponse } from '../../types/UpdateRouteQuery';

import { baseQueryWithReauth } from './auth.api';

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

    getAllRoutes: build.mutation<GetRoutesResponse[], object>({
      query: () => ({
        url: 'api/routes',
      }),
    }),

    getRouteById: build.query<GetRouteByIdResponse, number>({
      query: (id: number) => ({
        url: `api/routes/${id}`,
      }),
    }),

    getRoutesByUserId: build.query<GetRoutesResponse[], number>({
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
      query: body => ({
        url: 'api/routes/likes',
        method: 'POST',
        body,
      }),
    }),

    // getLikedByUserId: build.query({
    //   query: (id: number) => ({
    //     url: `api/routes/likes/user/${id}`
    //   })
    // }),

    dislikeRoute: build.mutation<MarkRouteResponse, MarkRoute>({
      query: body => ({
        url: 'api/routes/dislikes',
        method: 'POST',
        body,
      }),
    }),

    getObstacles: build.query<Obstacle[], void>({
      query: () => ({
        url: 'api/obstacles',
      }),
    }),
  }),
});

export const {
  useSaveRouteMutation,
  useGetAllRoutesMutation,
  useDeleteRouteMutation,
  useUpdateRouteMutation,
  useApproveRouteMutation,
  useGetRoutesByUserIdQuery,
  useLikeRouteMutation,
  useDislikeRouteMutation,
  useGetRouteByIdQuery,
  useGetObstaclesQuery,
  //useGetLikedByUserIdQuery
} = routesApi;
