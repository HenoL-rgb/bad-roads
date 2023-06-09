import { View } from 'react-native';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TabNavParamList } from '../pages/Home';
import RouteList from './RouteList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import useGetAllRoutes from '../hooks/useGetAllRoutes';
import { Route } from '../types/Route';
import { useAppSelector } from '../hooks/redux-hooks';

type RootProps = BottomTabNavigationProp<TabNavParamList>;

enum RootStack {
  Map = 'Map',
}

function DangerRoutes() {
  const navigation = useNavigation<RootProps>();
  const {routes, getAllRoutes, isLoading} = useGetAllRoutes();
  const theme = useAppSelector(state => state.themeReducer);

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
    <View style={{ flex: 1, paddingTop: 10, backgroundColor: theme.colors.card }}>
        <RouteList
          routes={dangerRoutes}
          navigate={routeNavigate}
          refetchMut={getAllRoutes}
          loading={isLoading}
        />
    </View>
  );
}

export default memo(DangerRoutes)