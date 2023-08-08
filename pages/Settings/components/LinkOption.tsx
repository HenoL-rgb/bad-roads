import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../../../utils/colors';

type LinkOptionType = {
  onPress: () => void;
  title: string;
  subTitle?: string;
  rTextStyle: { color: string };
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function LinkOption({
  onPress,
  title,
  subTitle,
  rTextStyle,
}: LinkOptionType) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Animated.Text style={[styles.text, rTextStyle]}>{title}</Animated.Text>
      <View style={styles.subItem}>
        {subTitle && (
          <Animated.Text style={[styles.subText]}>{subTitle}</Animated.Text>
        )}
        <AnimatedIcon name="chevron-right" size={25} style={[rTextStyle]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },

  text: {
    fontSize: 16,
  },

  subText: {
    fontSize: 15,
    color: colors.gray,
  },

  subItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
