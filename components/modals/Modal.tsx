import { Dimensions, StyleSheet } from 'react-native';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
} from 'react';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type ModalRefProps = {
  setActive: (value: boolean) => void;
};

const Modal = forwardRef<ModalRefProps, PropsWithChildren>(
  ({ children }, ref) => {
    const translateY = useSharedValue(0);
    const height = useSharedValue(0);

    const active = useSharedValue(false);

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: 9, mass: 0.4 });
      },
      [translateY, active],
    );

    const setActive = useCallback(
      (value: boolean) => {
        'worklet';
        if (!value) {
          active.value = value;
          scrollTo(0);
        } else {
          scrollTo(-SCREEN_HEIGHT + (height.value / 7));
        }
      },
      [active, scrollTo, height.value],
    );

    useImperativeHandle(ref, () => ({ setActive }), [setActive]);

    const rModalStyle = useAnimatedStyle(() => {
      return {
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

    // useFocusEffect(
    //   useCallback(() => {
    //     return () => {
    //       scrollTo(0);
    //     };
    //   }, [scrollTo]),
    // );

    return (
      <>
        <Animated.View
          onTouchStart={() => {
            // Dismiss the BottomSheet
            scrollTo(0);
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
        <Animated.View
          onLayout={(event) => height.value = event.nativeEvent.layout.height}
          style={[
            {
              minHeight: 350,
              width: 340,
              backgroundColor: 'white',
              overflow: 'hidden',
              position: 'absolute',
              alignSelf: 'center',
              top: SCREEN_HEIGHT,
              borderRadius: 15,
            },
            rModalStyle,
          ]}>
          {children}
        </Animated.View>
      </>
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;
