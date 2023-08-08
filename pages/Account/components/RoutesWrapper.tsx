import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';

import { useAppSelector } from '../../../hooks/redux-hooks';

export default function RoutesWrapper({ children }: PropsWithChildren) {
  const theme = useAppSelector(state => state.themeReducer);

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 5,
    paddingTop: 10,
  },
});
