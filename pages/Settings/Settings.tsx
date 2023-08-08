import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import i18next from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Appearance } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BackButton from '../../components/BackButton';
import Section from '../../components/Section';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  SettingsStackParamList,
  screens,
} from '../../navigation/SettingsWrapper';
import { useLogoutMutation } from '../../store/api/auth.api';
import { setTheme } from '../../store/slices/theme.slice';
import { LightTheme, DarkTheme, colors } from '../../utils/colors';
import languagesList from '../../utils/translations/languagesList';

import LinkOption from './components/LinkOption';
import SwitchOption from './components/SwitchOption';
import ThemeSwitch from './components/ThemeSwitch';

type Props = NativeStackScreenProps<SettingsStackParamList, screens.Settings>;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function Settings({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.themeReducer);
  const [logout] = useLogoutMutation({});
  const user = useAppSelector(state => state.userReducer);

  const progress = useDerivedValue(() => {
    return theme.dark
      ? withTiming(1, { duration: 310 })
      : withTiming(0, { duration: 310 });
  }, [theme.dark]);

  function toggleSwitch(value: string) {
    if (value === 'system') {
      Appearance.addChangeListener(({ colorScheme }) => {
        dispatch(setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme));
      });
      const systemTheme = Appearance.getColorScheme();
      dispatch(setTheme(systemTheme === 'dark' ? DarkTheme : LightTheme));
    } else {
      dispatch(setTheme(value === 'dark' ? DarkTheme : LightTheme));
    }
    EncryptedStorage.setItem('theme', value);
  }

  const rWrapperStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [LightTheme.colors.card, DarkTheme.colors.card],
    );

    return {
      backgroundColor,
    };
  });

  const rHeaderStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [LightTheme.colors.background, DarkTheme.colors.background],
    );

    return {
      backgroundColor,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [LightTheme.colors.text, DarkTheme.colors.text],
    );

    return {
      color,
    };
  });

  useFocusEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          style={[
            { ...StyleSheet.absoluteFillObject },
            rHeaderStyle,
          ]}></Animated.View>
      ),
      headerTitle: () => (
        <Animated.Text style={[styles.header, rTextStyle]}>
          {t('Settings')}
        </Animated.Text>
      ),
      headerLeft: props => <BackButton props={props} style={rTextStyle} />,
      headerRight: props => (
        <AnimatedIcon
          name="logout"
          size={20}
          {...props}
          onPress={async () => {
            if (!user.user) return;
            const notificationsToken = await messaging().getToken();
            logout({
              userId: user.user.id,
              notificationsToken,
            });
          }}
          style={[rTextStyle]}></AnimatedIcon>
      ),
    });
  });

  return (
    <Animated.ScrollView style={[styles.wrapper, rWrapperStyle]}>
      <Section header="App">
        <ThemeSwitch
          title={t('Theme')}
          rTextStyle={rTextStyle}
          theme={theme}
          toggleSwitch={toggleSwitch}
        />
        <LinkOption
          title={t('language')}
          subTitle={languagesList[i18next.language].nativeName}
          onPress={() => navigation.navigate(screens.Languages)}
          rTextStyle={rTextStyle}
        />
        <LinkOption
          title={t('PushNotifications')}
          onPress={() => navigation.navigate(screens.Languages)}
          rTextStyle={rTextStyle}
        />
      </Section>
      <Section header="map">
        <LinkOption
          title={t('language')}
          subTitle={languagesList[i18next.language].nativeName}
          onPress={() => navigation.navigate(screens.Languages)}
          rTextStyle={rTextStyle}
        />
        <SwitchOption
          title={t('nightMode')}
          rTextStyle={rTextStyle}
          onValueChange={(value: boolean) =>
            toggleSwitch(value ? 'dark' : 'light')
          }
          theme={theme}
        />
      </Section>
      <Section header="account">
        <View style={styles.item}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('Change password')}
          </Animated.Text>
        </View>
        <View style={styles.item}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('Delete account')}
          </Animated.Text>
        </View>
      </Section>
    </Animated.ScrollView>
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
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
  },
  subText: {
    fontSize: 15,
    color: colors.gray,
  },
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  themes: {
    rowGap: 10,
  },
  subItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  section: {},
  sectionHeader: {},
  sectionContent: {},
});
