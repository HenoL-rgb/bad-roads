import { View, Text } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminRoutesTabNavParamList, RoutesTabNavParamList } from '../navigation/AccountRoutesList';
import { useGetRoutesByUserIdQuery } from '../store/api/routes.api';
import { useNavigation } from '@react-navigation/native';
import { Tab, TabNavParamList } from './AppWrapper';
import RouteList from './RouteList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import useGetUserRoutes from '../hooks/useGetUserRoutes';
import useGetAllRoutes from '../hooks/useGetAllRoutes';
import { Route } from '../types/Route';

type Props = NativeStackScreenProps<AdminRoutesTabNavParamList, 'Routes'>;
type RootProps = BottomTabNavigationProp<TabNavParamList>;

enum RootStack {
  Map = 'Map',
}

export default function DangerRoutes() {
  const navigation = useNavigation<RootProps>();
  const {routes, refetch, isLoading} = useGetAllRoutes();

  const dangerRoutes: Route[] = routes.filter(route => {    
    if(route.likedUsers.length / route.dislikedUsers.length < 0.4) {
        return true;
    }
    return false
  })

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(RootStack.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {dangerRoutes && (
        <RouteList
          routes={dangerRoutes}
          navigate={routeNavigate}
          refetch={refetch}
          loading={isLoading}
        />
      )}
    </View>
  );
}
