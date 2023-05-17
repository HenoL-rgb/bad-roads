import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useRef } from 'react';
import { Route } from '../types/Route';
import { Polyline, YaMap } from 'react-native-yamap';
import { YANDEX_API_KEY } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RouteListItem = {
  route: Route;
  navigate: (lat: number, lon: number) => void;
};

export default function RouteListItem({ route, navigate }: RouteListItem) {
  const map = useRef<YaMap>(null);
  YaMap.init(YANDEX_API_KEY);

  return (
    <View style={styles.wrapper}>
      <YaMap
        showUserPosition={false}
        onMapPress={() => navigate(route.route[0].lat, route.route[0].lon)}
        style={{ width: 80, height: 80 }}
        nightMode={true}
        mapType={'vector'}
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
          strokeColor={'#f11515'}
          strokeWidth={4}
          zIndex={4}
        />
      </YaMap>
      <View style={styles.infoWrapper}>
        <View style={styles.geoInfo}>
          <Text style={styles.infoText}>lat: {route.route[0].lat.toFixed(5)}</Text>
          <Text style={styles.infoText}>lon: {route.route[0].lon.toFixed(5)}</Text>
        </View>
        <Pressable
          onPress={() => navigate(route.route[0].lat, route.route[0].lon)}>
          <Icon name="room" size={30} color="#c2c2c2" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#fcfcfc',
    overflow: 'hidden',
  },
  infoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 5,
  },

  geoInfo: {
    rowGap: 5
  },

  infoText: {
    color: '#000000',
  }
});
