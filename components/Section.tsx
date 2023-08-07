import { View, Text, StyleSheet } from 'react-native';
import React, { PropsWithChildren } from 'react';

type SectionProps = {
  header: string;
};

export default function Section({
  header,
  children,
}: PropsWithChildren<SectionProps>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>{header}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 5,
  },
  header: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  content: {
    paddingLeft: 10,
  },
});
