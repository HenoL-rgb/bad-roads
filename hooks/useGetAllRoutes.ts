import { useEffect, useState } from 'react';
import { useGetAllRoutesQuery } from '../store/api/routes.api';
import { Route } from '../types/Route';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { setRoutes } from '../store/slices/routes.slice';

const useGetAllRoutes = () => {
  const dispatch = useAppDispatch();
  const routes = useAppSelector(state => state.routesReducer.routes);
  const {
    data: routesData,
    refetch,
    isLoading,
  } = useGetAllRoutesQuery({});

  useEffect(() => {
    dispatch(setRoutes(
      routesData
        ? routesData?.map(
            (routeData: {
              id: number;
              createdAt: Date;
              isApproved: boolean;
              route: string;
            }) => ({ ...routeData, route: JSON.parse(routeData.route) }),
          )
        : [],
    ));
  }, [dispatch, routesData]);

  return {routes, refetch, isLoading};
};

export default useGetAllRoutes
