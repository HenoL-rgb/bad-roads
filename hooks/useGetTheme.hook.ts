import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setTheme } from '../store/slices/theme.slice';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { DarkTheme, LightTheme } from '../utils/colors';
import { Themes } from '../types/Themes';

export default function useGetTheme(): Themes {
  const deviceTheme = useColorScheme();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.themeReducer);

  useEffect(() => {
    async function getThemeFromStorage() {
      const theme: string | null = await EncryptedStorage.getItem('theme');
      console.log('Dark theme ', DarkTheme.colors);
      console.log('Light theme ', LightTheme.colors);

      if (theme) {
        return theme === 'light' ? LightTheme : DarkTheme;
      }      

      return deviceTheme
        ? deviceTheme === 'dark'
          ? DarkTheme
          : LightTheme
        : LightTheme;
    }

    getThemeFromStorage().then((value: Themes) => {
        dispatch(setTheme(value))
    });
  }, [deviceTheme, dispatch]);

  return theme;
}
