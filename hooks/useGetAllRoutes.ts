import { useEffect } from 'react';
import { useGetAllRoutesMutation } from '../store/api/routes.api';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { setRoutes } from '../store/slices/routes.slice';
import { GetRoutesResponse } from '../types/GetAllRoutesQuery';
import { transformRoute } from '../utils/transformRoute';

const useGetAllRoutes = () => {
  const dispatch = useAppDispatch();
  const routes = useAppSelector(state => state.routesReducer.routes);
  const [getAllRoutes, {isLoading}] = useGetAllRoutesMutation({});

  useEffect(() => {
    const fetchRoutes = async () => {      
      const routesData = await getAllRoutes({}).unwrap();
        dispatch(
          setRoutes(
            routesData
              ? routesData?.map((routeData: GetRoutesResponse) => transformRoute(routeData))
              : [],
          ),
        );
    }

    fetchRoutes();
  }, [dispatch, getAllRoutes]);

  return { routes, isLoading, getAllRoutes };
};

export default useGetAllRoutes;
