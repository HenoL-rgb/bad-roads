import { useEffect, useState } from 'react';

import { useGetRoutesByUserIdQuery } from '../store/api/routes.api';
import { GetRoutesResponse } from '../types/GetAllRoutesQuery';
import { Route } from '../types/Route';
import { transformRoute } from '../utils/transformRoute';

import { useAppSelector } from './redux-hooks';

const useGetUserRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const {
    data: routesData,
    refetch,
    isLoading,
  } = useGetRoutesByUserIdQuery(userId ?? 0, {
    skip: userId ? false : true,
  });

  useEffect(() => {
    setRoutes(
      routesData
        ? routesData?.map((routeData: GetRoutesResponse) =>
            transformRoute(routeData),
          )
        : [],
    );
  }, [routesData]);

  return { routes, refetch, isLoading };
};

export default useGetUserRoutes;
