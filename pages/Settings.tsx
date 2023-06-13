import {
  Text,
  SafeAreaView,
  View,
  Switch,
  StyleSheet,
  Button,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setTheme } from '../store/slices/theme.slice';
import {
  DarkTheme,
  DefaultTheme,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { withTheme } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStack, StackParamList } from './AppWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { clearUser, setAuth } from '../store/slices/user.slice';

type Props = NativeStackScreenProps<StackParamList, 'Settings'>;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Settings({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { dark, colors } = useAppSelector(state => state.themeReducer);

  const progress = useDerivedValue(() => {
    return dark
      ? withTiming(1, { duration: 200 })
      : withTiming(0, { duration: 300 });
  }, [dark]);

  const toggleSwitch = () => {
    dispatch(setTheme(dark ? DefaultTheme : DarkTheme));
    EncryptedStorage.setItem('theme', dark ? 'light' : 'dark');
  };

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
        <Animated.Text style={[styles.text, rTextStyle]}>
          Settings
        </Animated.Text>
      ),
      headerLeft: props => (
        <AnimatedIcon
          name="arrow-back"
          style={[{ paddingRight: 20, justifyContent: 'center' }, rTextStyle]}
          size={24}
          {...props}
          onPress={() => navigation.goBack()}></AnimatedIcon>
      ),
      headerRight: props => (
        <AnimatedIcon
          name="logout"
          size={20}
          {...props}
          onPress={async () => {
            dispatch(setAuth(false));
            await EncryptedStorage.clear();
          }}
          style={[
            rTextStyle,
          ]}></AnimatedIcon>
      ),
    });
  });

  return (
    <Animated.View style={[styles.wrapper, rWrapperStyle]}>
      <View style={styles.item}>
        <Animated.Text style={[styles.text, rTextStyle]}>
          Dark mode
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
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
});
