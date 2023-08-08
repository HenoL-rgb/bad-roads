import { useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import { setTheme } from '../store/slices/theme.slice';
import { ThemesType } from '../types/Themes';
import { DarkTheme, LightTheme } from '../utils/colors';

import { useAppDispatch, useAppSelector } from './redux-hooks';

export default function useGetTheme(): ThemesType {
  const deviceTheme = useColorScheme();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.themeReducer);

  useEffect(() => {
    async function getThemeFromStorage() {
      const theme: string | null = await EncryptedStorage.getItem('theme');

      if (theme) {
        if (theme === 'system') {
          Appearance.addChangeListener(({ colorScheme }) => {
            dispatch(setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme));
          });
          const systemTheme = Appearance.getColorScheme();
          return systemTheme === 'dark' ? DarkTheme : LightTheme;
        }

        return theme === 'light' ? LightTheme : DarkTheme;
      }

      return deviceTheme
        ? deviceTheme === 'dark'
          ? DarkTheme
          : LightTheme
        : LightTheme;
    }

    getThemeFromStorage().then((value: ThemesType) => {
      dispatch(setTheme(value));
    });
  }, [deviceTheme, dispatch]);

  return theme;
}
