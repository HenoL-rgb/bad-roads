import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setTheme } from '../store/slices/theme.slice';
import { useAppDispatch, useAppSelector } from './redux-hooks';

export default function useGetTheme(): Theme {
  const deviceTheme = useColorScheme();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.themeReducer);

  useEffect(() => {
    async function getThemeFromStorage() {
      const theme: string | null = await EncryptedStorage.getItem('theme');
      console.log(theme);
      
      if (theme) {
        return theme === 'light' ? DefaultTheme : DarkTheme;
      }      

      return deviceTheme
        ? deviceTheme === 'dark'
          ? DarkTheme
          : DefaultTheme
        : DefaultTheme;
    }

    getThemeFromStorage().then((value: Theme) => {
        dispatch(setTheme(value))
    });
  }, [deviceTheme, dispatch]);

  return theme;
}
