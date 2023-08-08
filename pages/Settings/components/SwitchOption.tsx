import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemesType } from '../../../types/Themes';

type SwitchOptionType = {
  rTextStyle: { color: string };
  theme: ThemesType;
  onValueChange: (value: boolean) => void;
  title: string;
  value: boolean;
};

export default function SwitchOption({
  rTextStyle,
  theme,
  onValueChange,
  title,
  value,
}: SwitchOptionType) {
  return (
    <View style={styles.item}>
      <Animated.Text style={[styles.text, rTextStyle]}>{title}</Animated.Text>
      <Switch
        trackColor={{ false: '#8a8a8a', true: '#c0c0c0' }}
        thumbColor={theme.dark ? '#e9e9e9' : '#a7a7a7'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
        style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
      />
    </View>
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
});
