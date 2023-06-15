import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { SvgProps } from 'react-native-svg';
import { colors } from '../../../utils/colors';

type ObstaclesItemProps = {
  Icon: React.FC<SvgProps>;
  id: number;
  description: string;
  handlePress: (id: number) => void;
};

export default function ObstaclesItem({
  Icon,
  description,
  handlePress,
  id,
}: ObstaclesItemProps) {
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
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  iconWrapper: {
    padding: 10,
    backgroundColor: colors.eyePress,
    justifyContent: 'center',
  },
  description: {
    flex: 1,
    padding: 10,
  },
});
