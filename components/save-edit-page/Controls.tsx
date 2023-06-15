import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import { Theme } from '@react-navigation/native';
import { colors } from '../../utils/colors';

type ControlsProps = {
  handleCancel: () => void;
  theme: Theme;
  handleSaveRoute: () => void;
  Loading: boolean;
  mode: 'save' | 'update';
};

export default function Controls({
  handleCancel,
  theme,
  handleSaveRoute,
  Loading,
  mode,
}: ControlsProps) {
  return (
    <View style={styles.buttons}>
      <Pressable onPress={handleCancel} style={styles.cancelBtn}>
        <Text style={[{ color: theme.colors.text }]}>CANCEL</Text>
      </Pressable>
      <Pressable
        style={[
          styles.cancelBtn,
          styles.saveBtn,
          { backgroundColor: theme.colors.text },
        ]}
        onPress={handleSaveRoute}>
        {Loading ? (
          <ActivityIndicator size={'small'} color={colors.white} />
        ) : (
          <Text style={[{ color: theme.colors.card }]}>{mode.toUpperCase()}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cancelBtn: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: colors.blue,
    width: 90,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
