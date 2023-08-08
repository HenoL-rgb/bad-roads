import { View, StyleSheet, Pressable, Appearance, Switch } from 'react-native';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { setTheme } from '../../store/slices/theme.slice';
import { useFocusEffect } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/BackButton';
import messaging from '@react-native-firebase/messaging';
import { useLogoutMutation } from '../../store/api/auth.api';
import { LightTheme, DarkTheme, colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { SettingsStackParamList, screens } from './SettingsWrapper';
import i18next from 'i18next';
import languagesList from '../../utils/translations/languagesList';
import Section from '../../components/Section';
import SwitchSelector from 'react-native-switch-selector';
import { themeOptions } from '../../constants/themeOptions';

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
        <View style={styles.themes}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('Theme')}
          </Animated.Text>
          <SwitchSelector
            options={themeOptions}
            initial={themeOptions.findIndex(item => item.value === theme.name)}
            onPress={toggleSwitch}
            textColor={theme.colors.text}
            hasPadding
            valuePadding={1}
            borderRadius={10}
            buttonColor={theme.colors.card}
            backgroundColor={theme.colors.background}
            selectedColor={theme.colors.text}
            borderColor={theme.colors.border}
            animationDuration={250}
            buttonMargin={1}
          />
        </View>

        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate(screens.Languages)}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('language')}
          </Animated.Text>
          <View style={styles.subItem}>
            <Animated.Text style={[styles.subText]}>
              {languagesList[i18next.language].nativeName}
            </Animated.Text>
            <AnimatedIcon name="chevron-right" size={25} style={[rTextStyle]} />
          </View>
        </Pressable>
        <View style={styles.item}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('PushNotifications')}
          </Animated.Text>
        </View>
      </Section>
      <Section header="map">
        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate(screens.Languages)}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('language')}
          </Animated.Text>
          <View style={styles.subItem}>
            <Animated.Text style={[styles.subText]}>
              {languagesList[i18next.language].nativeName}
            </Animated.Text>
            <AnimatedIcon name="chevron-right" size={25} style={[rTextStyle]} />
          </View>
        </Pressable>
        <View style={styles.item}>
          <Animated.Text style={[styles.text, rTextStyle]}>
            {t('nightMode')}
          </Animated.Text>
          <Switch
            trackColor={{ false: '#8a8a8a', true: '#c0c0c0' }}
            thumbColor={theme.dark ? '#e9e9e9' : '#a7a7a7'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={console.log}
            value={theme.dark}
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
          />
        </View>
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
