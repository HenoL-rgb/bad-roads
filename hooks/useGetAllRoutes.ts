import { useEffect, useState } from 'react';
import { useGetAllRoutesQuery } from '../store/api/routes.api';
import { Route } from '../types/Route';

const useGetAllRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
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
