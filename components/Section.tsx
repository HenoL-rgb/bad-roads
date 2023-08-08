import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useAppSelector } from '../hooks/redux-hooks';

type SectionProps = {
  header: string;
};

export default function Section({
  header,
  children,
}: PropsWithChildren<SectionProps>) {
  const theme = useAppSelector(state => state.themeReducer);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.header, { color: theme.colors.text }]}>
        {header}
      </Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 5,
    rowGap: 10,
  },
  header: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontWeight: '400',
    opacity: 0.6,
  },
  content: {
    paddingLeft: 10,
  },
});
