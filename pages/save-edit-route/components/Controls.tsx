import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { colors } from '../../../utils/colors';
import { ThemesType } from '../../../types/Themes';

type ControlsProps = {
  handleCancel: () => void;
  theme: ThemesType;
  handleSaveRoute: () => void;
  Loading: boolean;
  mode: 'save' | 'update';
  saveDisabled: boolean;
};

export default function Controls({
  handleCancel,
  theme,
  handleSaveRoute,
  Loading,
  mode,
  saveDisabled
}: ControlsProps) {
  return (
    <View style={styles.buttons}>
      <Pressable onPress={handleCancel} style={styles.cancelBtn}>
        <Text style={[{ color: theme.colors.text }]}>CANCEL</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.cancelBtn,
          styles.saveBtn,
          { backgroundColor: theme.colors.text, opacity: saveDisabled ? 0.4 : pressed ? 0.8 : 1 },
        ]}
        onPress={handleSaveRoute}
        disabled={saveDisabled}
        >
        {Loading ? (
          <ActivityIndicator size={'small'} color={theme.colors.activity} />
        ) : (
          <Text style={[{ color: theme.colors.card }]}>
            {mode.toUpperCase()}
          </Text>
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
