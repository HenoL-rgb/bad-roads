import { useEffect } from 'react';

import { RefetchMutationType } from '../pages/Account/components/RouteList';
import { useGetAllRoutesMutation } from '../store/api/routes.api';
import { setRoutes } from '../store/slices/routes.slice';
import { GetRoutesResponse } from '../types/GetAllRoutesQuery';
import { Route } from '../types/Route';
import { transformRoute } from '../utils/transformRoute';

import { useAppDispatch, useAppSelector } from './redux-hooks';

const useGetAllRoutes = (): {
  routes: Route[];
  isLoading: boolean;
  getAllRoutes: RefetchMutationType;
} => {
  const dispatch = useAppDispatch();
  const routes = useAppSelector(state => state.routesReducer.routes);
  const [getAllRoutes, { isLoading }] = useGetAllRoutesMutation({});

  useEffect(() => {
    const fetchRoutes = async () => {
      const routesData = await getAllRoutes({}).unwrap();
      dispatch(
        setRoutes(
          routesData
            ? routesData?.map((routeData: GetRoutesResponse) =>
                transformRoute(routeData),
              )
            : [],
        ),
      );
    };

    fetchRoutes();
  }, [dispatch, getAllRoutes]);

  return { routes, isLoading, getAllRoutes };
};

export default useGetAllRoutes;
