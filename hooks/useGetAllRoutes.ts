import { useEffect, useState } from 'react';
import { useGetAllRoutesQuery, useGetRoutesByUserIdQuery } from '../store/api/routes.api';
import { Route } from '../types/Route';
import { useAppSelector } from './redux-hooks';

const useGetAllRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const {
    data: routesData,
    refetch,
    isLoading,
  } = useGetAllRoutesQuery({});

  useEffect(() => {
    setRoutes(
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
    );
  }, [routesData]);

  return {routes, refetch, isLoading};
};

export default useGetAllRoutes
