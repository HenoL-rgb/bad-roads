import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GalleryImage({ image }: { image: {path: string} }) {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: event => {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onActive: event => {
        scale.value = event.scale;
      },
      onEnd: () => {
        scale.value = withTiming(1);
      },
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -SCREEN_WIDTH / 2 },
        { translateY: -SCREEN_HEIGHT / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: SCREEN_WIDTH / 2 },
        { translateY: SCREEN_HEIGHT / 2 },
      ],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <AnimatedImage
        style={[
          {
            width: SCREEN_WIDTH,
            height: undefined,
            resizeMode: 'contain',
          },
          rStyle,
        ]}
        source={{
          uri: image.path,
        }}
      />
    </PinchGestureHandler>
  );
}
