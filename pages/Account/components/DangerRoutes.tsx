import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';

import useGetAllRoutes from '../../../hooks/useGetAllRoutes';
import { Route } from '../../../types/Route';
import { HomeScreens, TabNavParamList } from '../../Home';

import RouteList from './RouteList';
import RoutesWrapper from './RoutesWrapper';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

function DangerRoutes() {
  const navigation = useNavigation<RootProps>();
  const { routes, getAllRoutes, isLoading } = useGetAllRoutes();

  const dangerRoutes: Route[] = routes.filter(route => {
    if (route.likedUsers.length / route.dislikedUsers.length < 0.4) {
      return true;
    }
    return false;
  });

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(HomeScreens.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <RoutesWrapper>
      <RouteList
        routes={dangerRoutes}
        navigate={routeNavigate}
        refetchMut={getAllRoutes}
        loading={isLoading}
      />
    </RoutesWrapper>
  );
}

export default memo(DangerRoutes);
