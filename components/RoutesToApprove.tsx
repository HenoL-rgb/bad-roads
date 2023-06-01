import { View } from 'react-native';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TabNavParamList } from '../pages/Home';
import RouteList from './RouteList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import useGetAllRoutes from '../hooks/useGetAllRoutes';
import { useAppSelector } from '../hooks/redux-hooks';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

enum RootStack {
  Map = 'Map',
}

 function RoutesToApprove() {
  const navigation = useNavigation<RootProps>();
  const {routes, refetch, isLoading} = useGetAllRoutes();
  const theme = useAppSelector(state => state.themeReducer)

  const notApprovedRoutes = routes.filter(route => !route.isApproved)

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate(RootStack.Map, {
      lat: lat,
      lon: lon,
    });
  }

  return (
    <View style={{ flex: 1, paddingTop: 10, backgroundColor: theme.colors.card }}>
        <RouteList
          routes={notApprovedRoutes}
          navigate={routeNavigate}
          refetch={refetch}
          loading={isLoading}
        />
    </View>
  );
}

export default memo(RoutesToApprove)