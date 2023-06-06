import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-yamap';
import { MapCurrentRoute } from '../types/Route';
import Animated, { BounceIn, BounceInDown, BounceOutDown, ZoomIn, ZoomInDown, ZoomOut, ZoomOutDown } from 'react-native-reanimated';

type MapMarkersProps = {
  markersVisible: {
    start: boolean;
    end: boolean;
  };
  currentRoute: MapCurrentRoute;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
};

enum currentMarker {
  START,
  END,
}

export default function MapMarkers({
  markersVisible,
  currentRoute,
  current,
  setCurrent,
}: MapMarkersProps) {
  return (
    <>
      {markersVisible.end && currentRoute.end && (
        <Marker
          point={currentRoute.end}
          scale={current === currentMarker.END ? 1.2 : 1}
          onPress={() => {
            setCurrent(currentMarker.END);
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
          scale={current === currentMarker.START ? 1.2 : 1}
          onPress={() => {
            if (markersVisible.end) {
              setCurrent(currentMarker.START);
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
