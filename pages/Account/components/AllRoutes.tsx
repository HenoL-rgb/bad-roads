import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';

import useGetAllRoutes from '../../../hooks/useGetAllRoutes';
import { HomeScreens, TabNavParamList } from '../../Home';

import RouteList from './RouteList';
import RoutesWrapper from './RoutesWrapper';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

function AllRoutes() {
  const navigation = useNavigation<RootProps>();
  const { routes, getAllRoutes, isLoading } = useGetAllRoutes();

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(HomeScreens.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <RoutesWrapper>
      {routes.length !== 0 && (
        <RouteList
          routes={routes}
          navigate={routeNavigate}
          refetchMut={getAllRoutes}
          loading={isLoading}
        />
      )}
    </RoutesWrapper>
  );
}

export default memo(AllRoutes);
