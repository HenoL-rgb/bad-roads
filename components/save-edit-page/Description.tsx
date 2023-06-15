import { View, Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';

export default function Description() {
  return (
    <View style={styles.section}>
      <Text style={styles.text}>Description</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Put some info here"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textarea: {
    marginTop: 10,
    borderRadius: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 10,
    paddingTop: 10,
    minHeight: 100,
  },
  text: {
    color: colors.black,
    fontSize: 18,
    paddingLeft: 3,
  },
  section: {
    borderRadius: 5,
  },
});
