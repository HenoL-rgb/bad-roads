import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { ThemesType } from '../../../../types/Themes';
import { colors } from '../../../../utils/colors';
import * as assets from '../../assets';

type Key = keyof typeof assets;

type ObstaclesItemProps = {
  theme: ThemesType;
  icon: Key;
  id: number;
  description: string;
  handlePress: (id: number) => void;
};

export default function ObstaclesItem({
  theme,
  icon,
  description,
  handlePress,
  id,
}: ObstaclesItemProps) {
  const Icon = assets[icon];
  return (
    <Pressable
      onPress={() => handlePress(id)}
      style={({ pressed }) => [
        {
          ...styles.wrapper,
        },
        {
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      <View style={styles.iconWrapper}>
        <Icon />
      </View>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 5,
  },
  iconWrapper: {
    padding: 10,
    backgroundColor: colors.eyePress,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  description: {
    flex: 1,
    padding: 10,
  },
});
