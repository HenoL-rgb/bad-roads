import { View } from 'react-native';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeScreens, TabNavParamList } from '../../Home';
import RouteList from './RouteList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import useGetAllRoutes from '../../../hooks/useGetAllRoutes';
import { useAppSelector } from '../../../hooks/redux-hooks';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

function RoutesToApprove() {
  const navigation = useNavigation<RootProps>();
  const { routes, getAllRoutes, isLoading } = useGetAllRoutes();
  const theme = useAppSelector(state => state.themeReducer);

  const notApprovedRoutes = routes.filter(route => !route.isApproved);

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
        routes={notApprovedRoutes}
        navigate={routeNavigate}
        refetchMut={getAllRoutes}
        loading={isLoading}
      />
    </View>
  );
}

export default memo(RoutesToApprove);
