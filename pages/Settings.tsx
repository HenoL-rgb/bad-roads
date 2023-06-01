import { Text, SafeAreaView, View, Switch, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setTheme } from '../store/slices/theme.slice';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function Settings() {
  const dispatch = useAppDispatch();
  const { dark, colors } = useAppSelector(state => state.themeReducer);

  const toggleSwitch = () => {
    dispatch(setTheme(dark ? DefaultTheme : DarkTheme));
    EncryptedStorage.setItem('theme', dark ? 'light' : 'dark');
  };
  return (
    <SafeAreaView style={[styles.wrapper, {backgroundColor: colors.card}]}>
      <View style={styles.item}>
        <Text style={[styles.text, {color: colors.text}]}>Dark mode</Text>
        <Switch
          trackColor={{ false: '#8a8a8a', true: '#c0c0c0' }}
          thumbColor={dark ? '#e9e9e9' : '#a7a7a7'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={dark}
          style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
        
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    text: {
        fontSize: 18,
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
    }
})
