import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-yamap';
import Animated, { ZoomInDown } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setCurrentMarker } from '../store/slices/routes.slice';

enum CurrentMarker {
  START,
  END,
}

export default function MapMarkers() {

  const {markersVisible, currentRoute, currentMarker} = useAppSelector(state => state.routesReducer);
  const dispatch = useAppDispatch();

  return (
    <>
      {markersVisible.end && currentRoute.end && (
        <Marker
          point={currentRoute.end}
          scale={currentMarker === CurrentMarker.END ? 1.2 : 1}
          onPress={() => {
            dispatch(setCurrentMarker(CurrentMarker.END));
          }}>
          <Animated.View entering={ZoomInDown.springify().mass(0.1).damping(10)} style={styles.marker}>
            <View style={styles.markerTop}></View>
            <View style={styles.markerBottom}></View>
          </Animated.View>
        </Marker>
      )}

      {markersVisible.start && currentRoute.start && (
        <Marker
          point={currentRoute.start}
          scale={currentMarker === CurrentMarker.START ? 1.2 : 1}
          onPress={() => {
            if (markersVisible.end) {
              dispatch(setCurrentMarker(CurrentMarker.START));
            }
          }}>
          <View style={styles.marker}>
            <View
              style={{
                ...styles.markerTop,
                backgroundColor: 'green',
              }}></View>
            <View
              style={{
                ...styles.markerBottom,
                backgroundColor: 'green',
              }}></View>
          </View>
        </Marker>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  marker: {
    height: 40,
    width: 20,
    position: 'relative',
  },
  markerBottom: {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    bottom: 18,
    left: 5,
  },
  markerTop: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 50,
    position: 'absolute',
  },
});
