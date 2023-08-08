import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import SwitchSelector from 'react-native-switch-selector';

import { themeOptions } from '../../../constants/themeOptions';
import { ThemesType } from '../../../types/Themes';

type ThemeSwitchProps = {
  rTextStyle: { color: string };
  title: string;
  toggleSwitch: (value: string) => void;
  theme: ThemesType;
};

export default function ThemeSwitch({
  rTextStyle,
  title,
  toggleSwitch,
  theme,
}: ThemeSwitchProps) {
  return (
    <View style={styles.themes}>
      <Animated.Text style={[styles.text, rTextStyle]}>{title}</Animated.Text>
      <SwitchSelector
        options={themeOptions}
        initial={themeOptions.findIndex(item => item.value === theme.name)}
        onPress={toggleSwitch}
        textColor={theme.colors.text}
        hasPadding
        valuePadding={1}
        borderRadius={10}
        buttonColor={theme.colors.card}
        backgroundColor={theme.colors.background}
        selectedColor={theme.colors.text}
        borderColor={theme.colors.border}
        animationDuration={250}
        buttonMargin={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  themes: {
    rowGap: 10,
  },
  text: {
    fontSize: 16,
  },
});
