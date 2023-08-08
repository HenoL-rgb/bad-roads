import { View } from 'react-native';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
} from 'react';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useAppSelector } from '../../hooks/redux-hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 150;

type BottomSheetProps = {
  hideSheet: () => void;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
};

const BottomSheet = forwardRef<
  BottomSheetRefProps,
  PropsWithChildren<BottomSheetProps>
>(({ hideSheet, children }, ref) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);
  const theme = useAppSelector(state => state.themeReducer);

  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';
      active.value = destination !== 0;
      translateY.value = withSpring(destination, { damping: 10, mass: 0.4 });
    },
    [translateY, active],
  );

  useImperativeHandle(ref, () => ({ scrollTo }), [scrollTo]);

  const tap = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 2.5) {
        scrollTo(0);
        runOnJS(hideSheet)();
      } else if (translateY.value < -SCREEN_HEIGHT / 1.65) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        scrollTo(-350);
      }
    });

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

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0, { duration: 350 }),
    };
  }, []);

  const rBackdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: active.value ? 'auto' : 'none',
    } as never;
  }, []);

  return (
    <>
      <Animated.View
        onTouchStart={() => {
          // Dismiss the BottomSheet
          scrollTo(0);
          runOnJS(hideSheet)();
        }}
        animatedProps={rBackdropProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
          rBackdropStyle,
        ]}
        pointerEvents="none"></Animated.View>
      <GestureDetector gesture={tap}>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            rBottomSheetStyle,
            { backgroundColor: theme.colors.background },
          ]}>
          <View style={styles.line}></View>
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
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

  backdrop: {},
});
