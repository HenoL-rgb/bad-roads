import { View, Text } from 'react-native';
import React, { memo, useRef } from 'react';
import { Route } from '../types/Route';
import { YANDEX_API_KEY } from '@env';
import YaMap, { Polyline } from 'react-native-yamap';
import { colors } from '../utils/colors';

type RouteListItem = {
  route: Route;
  navigate: (lat: number, lon: number) => void;
};

function MiniMap({ route, navigate }: RouteListItem) {
  const map = useRef<YaMap>(null);
  return (
    <YaMap
      showUserPosition={false}
      onMapPress={() => navigate(route.route[0].lat, route.route[0].lon)}
      style={{ width: 80, height: 80 }}
      nightMode={true}
      mapType={'vector'}
      key={route.id}
      ref={map}
      initialRegion={{
        lat: route.route[0].lat,
        lon: route.route[0].lon,
        zoom: 15,
        azimuth: 0,
      }}>
      <Polyline
        key={route.id}
        points={route.route}
        strokeColor={colors.badRoute}
        strokeWidth={4}
        zIndex={4}
      />
    </YaMap>
  );
}

export default memo(MiniMap);
