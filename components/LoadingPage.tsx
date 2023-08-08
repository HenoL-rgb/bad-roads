import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';

import { useAppSelector } from '../hooks/redux-hooks';

export default function LoadingPage() {
  const theme = useAppSelector(state => state.themeReducer);
  return (
    <SafeAreaView
      style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.background },
      ]}>
      <ActivityIndicator size="large" color={theme.colors.activity} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
