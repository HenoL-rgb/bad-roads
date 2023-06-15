import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  withTiming,
  withRepeat,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Icon } from 'react-native-elements';
import { colors } from '../../utils/colors';

type IconProps = {
  name: string;
};

export default function TopIcon({ name }: IconProps) {
  const progress = useSharedValue(1.15);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: progress.value }],
    };
  });

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [progress]);
  return (
    <View style={[styles.saveIconWrapper]}>
      <Animated.View style={[styles.saveIcon, reanimatedStyle]}>
        <Icon name={name} size={50} color={colors.blue} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  saveIcon: {
    padding: 20,
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 50,
  },
  saveIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
});
