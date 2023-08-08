import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

import { ThemesType } from '../../../types/Themes';
import { colors } from '../../../utils/colors';

type DescriptionProps = {
  theme: ThemesType;
  description: string | null;
  setDescription: (value: string) => void;
};

export default function Description({
  theme,
  description,
  setDescription,
}: DescriptionProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Description
      </Text>
      <TextInput
        style={styles.textarea}
        placeholder="Put some info here"
        multiline
        value={description ? description : ''}
        onChangeText={text => setDescription(text)}
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
