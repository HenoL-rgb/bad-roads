import { View, Switch, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { setTheme } from '../../store/slices/theme.slice';
import {
  DarkTheme,
  DefaultTheme,
  useFocusEffect,
} from '@react-navigation/native';
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
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { SettingsStackParamList, screens } from './SettingsWrapper';
import i18next from 'i18next';
import languagesList from '../../utils/translations/languagesList';

type Props = NativeStackScreenProps<SettingsStackParamList, screens.Settings>;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function Settings({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { dark } = useAppSelector(state => state.themeReducer);
  const [logout] = useLogoutMutation({});
  const user = useAppSelector(state => state.userReducer);

  const progress = useDerivedValue(() => {
    return dark
      ? withTiming(1, { duration: 200 })
      : withTiming(0, { duration: 300 });
  }, [dark]);

  function toggleSwitch() {
    dispatch(setTheme(dark ? DefaultTheme : DarkTheme));
    EncryptedStorage.setItem('theme', dark ? 'light' : 'dark');
  }

  const rWrapperStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [DefaultTheme.colors.card, DarkTheme.colors.card],
    );

    return {
      backgroundColor,
    };
  });

  const rHeaderStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [DefaultTheme.colors.background, DarkTheme.colors.background],
    );

    return {
      backgroundColor,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [DefaultTheme.colors.text, DarkTheme.colors.text],
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
        <Animated.Text style={[styles.text, rTextStyle, { fontWeight: '500' }]}>
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
    <Animated.View style={[styles.wrapper, rWrapperStyle]}>
      <View style={styles.item}>
        <Animated.Text style={[styles.text, rTextStyle]}>
          {t('darkMode')}
        </Animated.Text>
        <Switch
          trackColor={{ false: '#8a8a8a', true: '#c0c0c0' }}
          thumbColor={dark ? '#e9e9e9' : '#a7a7a7'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={dark}
          style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
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
    </Animated.View>
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
  subItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
