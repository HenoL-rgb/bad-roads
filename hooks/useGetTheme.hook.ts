import { useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { setTheme } from '../store/slices/theme.slice';
import { ThemesType, themes } from '../types/Themes';
import { DarkTheme, LightTheme } from '../utils/colors';

import { useAppDispatch, useAppSelector } from './redux-hooks';

export default function useGetTheme(): ThemesType {
  const deviceTheme = useColorScheme();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.themeReducer);

  useEffect(() => {
    async function getThemeFromStorage() {
      if (theme) {
        if (theme.name === 'system') {
          Appearance.addChangeListener(({ colorScheme }) => {
            dispatch(setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme));
          });
          const systemTheme = Appearance.getColorScheme();
          return systemTheme === 'dark'
            ? { ...DarkTheme, name: themes.System }
            : { ...LightTheme, name: themes.System };
        }

        return theme.name === 'light' ? LightTheme : DarkTheme;
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
  }, [deviceTheme, dispatch, theme]);

  return theme;
}
