import { View, Text } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutesTabNavParamList } from '../navigation/AccountRoutesList';
import { useGetRoutesByUserIdQuery } from '../store/api/routes.api';
import { useNavigation } from '@react-navigation/native';
import { Tab, TabNavParamList } from './AppWrapper';
import RouteList from './RouteList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import useGetUserRoutes from '../hooks/useGetUserRoutes';

type Props = NativeStackScreenProps<RoutesTabNavParamList, 'MyRoutes'>;
type RootProps = BottomTabNavigationProp<TabNavParamList>;

enum RootStack {
  Map = 'Map',
}

export default function MyRoutes({ route }: Props) {
  const navigation = useNavigation<RootProps>();
  const userId = route.params.userId;
  const {routes, refetch, isLoading} = useGetUserRoutes();

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(RootStack.Map, {
      lat: lat,
      lon: lon,
    });
  }
    
  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {routes && (
        <RouteList
          routes={routes}
          navigate={routeNavigate}
          refetch={refetch}
          loading={isLoading}
        />
      )}
    </View>
  );
}
