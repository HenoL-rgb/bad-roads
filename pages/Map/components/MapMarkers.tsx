import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-yamap';
import Animated from 'react-native-reanimated';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux-hooks';
import { setCurrentMarker } from '../../../store/slices/routes.slice';

enum CurrentMarker {
  START,
  END,
}

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

export default function MapMarkers() {
  const { markersVisible, currentRoute, currentMarker } = useAppSelector(
    state => state.routesReducer,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      {markersVisible.end && currentRoute.end && (
        <AnimatedMarker
          point={currentRoute.end}
          scale={currentMarker === CurrentMarker.END ? 1.2 : 1}
          onPress={() => {
            dispatch(setCurrentMarker(CurrentMarker.END));
          }}>
          <Animated.View style={styles.marker}>
            <Animated.View style={styles.markerTop}></Animated.View>
            <Animated.View style={styles.markerBottom}></Animated.View>
          </Animated.View>
        </AnimatedMarker>
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
          <Animated.View style={styles.marker}>
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
          </Animated.View>
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
