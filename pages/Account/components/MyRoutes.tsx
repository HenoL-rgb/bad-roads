import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import useGetUserRoutes from '../../../hooks/useGetUserRoutes';
import { HomeScreens, TabNavParamList } from '../../Home';

import RouteList from './RouteList';
import RoutesWrapper from './RoutesWrapper';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

export default function MyRoutes() {
  const navigation = useNavigation<RootProps>();
  const { routes, refetch, isLoading } = useGetUserRoutes();

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(HomeScreens.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <RoutesWrapper>
      <RouteList
        routes={routes}
        navigate={routeNavigate}
        refetch={refetch}
        loading={isLoading}
      />
    </RoutesWrapper>
  );
}
