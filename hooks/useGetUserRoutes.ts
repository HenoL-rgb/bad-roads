import { useEffect, useState } from 'react';
import { useGetRoutesByUserIdQuery } from '../store/api/routes.api';
import { useAppSelector } from './redux-hooks';
import { GetRouteByIdResponse, GetRoutesResponse } from '../types/GetAllRoutesQuery';

const useGetUserRoutes = () => {
  const [routes, setRoutes] = useState<GetRoutesResponse[]>([]);
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
        ? routesData?.map(
            (routeData: GetRoutesResponse) => ({ ...routeData, route: JSON.parse(routeData.route) }),
          )
        : [],
    );
  }, [routesData]);

  return {routes, refetch, isLoading};
};

export default useGetUserRoutes
