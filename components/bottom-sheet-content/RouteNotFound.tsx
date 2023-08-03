import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Theme } from '@react-navigation/native';

type RouteNotFoundProps = {
  theme: Theme;
};

export default function RouteNotFound({ theme }: RouteNotFoundProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.text, {color: theme.colors.text}]}>Route Not Found :(</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    top: 100,
    fontSize: 22,
  },
});