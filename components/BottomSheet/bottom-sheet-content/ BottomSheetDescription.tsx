import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { ThemesType } from '../../../types/Themes';
import { colors } from '../../../utils/colors';

type Props = {
  theme: ThemesType;
  description: string;
};

export default function BottomSheetDescription({ theme, description }: Props) {
  return (
    <View style={[styles.description, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>
        Description
      </Text>
      <ScrollView>
        <Text style={[styles.modalText, { color: theme.colors.text }]}>
          {description}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    maxHeight: 250,
    backgroundColor: colors.eyePress,
    justifyContent: 'flex-start',
  },

  descriptionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },

  modalText: {
    marginBottom: 15,
    paddingLeft: 2,
    fontSize: 16,
    color: colors.black,
  },
});
