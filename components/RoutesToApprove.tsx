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

type Props = NativeStackScreenProps<AdminRoutesTabNavParamList, 'Routes'>;
type RootProps = BottomTabNavigationProp<TabNavParamList>;

enum RootStack {
  Map = 'Map',
}

export default function RoutesToApprove() {
  const navigation = useNavigation<RootProps>();
  const {routes, refetch, isLoading} = useGetAllRoutes();

  const notApprovedRoutes = routes.filter(route => !route.isApproved)

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(RootStack.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {notApprovedRoutes && (
        <RouteList
          routes={notApprovedRoutes}
          navigate={routeNavigate}
          refetch={refetch}
          loading={isLoading}
        />
      )}
    </View>
  );
}
