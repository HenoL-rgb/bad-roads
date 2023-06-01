import { View, Text } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { ComposedGesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import RoutePopUp from './BottomSheetContent';
import BottomSheetContent from './BottomSheetContent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 150;

type BottomSheetProps = {
  modalVisible: boolean;
  hideSheet: () => void;
  deleteRoute: (id: number) => void;
  editRoute: (id: number) => void;
  routeId: number;
};

export default function BottomSheet({
    modalVisible,
    hideSheet,
    deleteRoute,
    editRoute,
    routeId
} : BottomSheetProps) {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';
      translateY.value = withSpring(destination, { damping: 20 });
    },
    [translateY],
  );

  const tap = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 4) {
        scrollTo(0);
      } else if (translateY.value < -SCREEN_HEIGHT / 1.7) {
        scrollTo(MAX_TRANSLATE_Y);
        hideSheet();
      }
    });

  useEffect(() => {
    if(modalVisible) {
        scrollTo(-SCREEN_HEIGHT / 3);
    }
  }, [scrollTo, modalVisible]);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 10],
      Extrapolate.CLAMP,
    );
    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line}></View>
        <BottomSheetContent deleteRoute={deleteRoute} editRoute={editRoute} routeId={routeId} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});
