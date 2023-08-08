import React from 'react';
import { Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';

import { ThemesType } from '../../../types/Themes';
import { colors } from '../../../utils/colors';

type ServerErrorProps = {
  theme: ThemesType;
  retryConnection: () => void;
};

export default function ServerError({
  theme,
  retryConnection,
}: ServerErrorProps) {
  return (
    <SafeAreaView
      style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.background },
      ]}>
      <Text style={{ color: theme.colors.text }}>Server error :(</Text>
      <Pressable
        style={[styles.retryBtn, { backgroundColor: theme.colors.border }]}
        onPress={retryConnection}>
        <Text style={{ color: theme.colors.text }}>Retry</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: colors.eyePress,
  },
});
