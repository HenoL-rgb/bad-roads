import { View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeScreens, TabNavParamList } from '../../pages/Home';
import RouteList from '../RouteList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import useGetUserRoutes from '../../hooks/useGetUserRoutes';
import { useAppSelector } from '../../hooks/redux-hooks';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

export default function MyRoutes() {
  const navigation = useNavigation<RootProps>();
  const { routes, refetch, isLoading } = useGetUserRoutes();

  const theme = useAppSelector(state => state.themeReducer);

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(HomeScreens.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <View
      style={{ flex: 1, paddingTop: 10, backgroundColor: theme.colors.card }}>
      <RouteList
        routes={routes}
        navigate={routeNavigate}
        refetch={refetch}
        loading={isLoading}
      />
    </View>
  );
}
