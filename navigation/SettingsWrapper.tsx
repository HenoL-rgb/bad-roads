import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import BackButton from '../components/BackButton';
import { useAppSelector } from '../hooks/redux-hooks';
import Languages from '../pages/Settings/Languages';
import PushNotifications from '../pages/Settings/PushNotifications';
import Settings from '../pages/Settings/Settings';
import {
  SettingsStackParamList,
  screens,
} from '../types/routesTypes/SettingsWrapperTypes';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsWrapper() {
  const { colors: theme } = useAppSelector(state => state.themeReducer);
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName={screens.Settings}
      screenOptions={{
        headerBackVisible: false,
        animation: 'slide_from_right',

        headerBackground: () => (
          <View style={[{ ...StyleSheet.absoluteFillObject }]}></View>
        ),
        headerTitleStyle: {
          color: theme.text,
          fontSize: 18,
          fontWeight: 'normal',
        },
        headerTintColor: theme.text,
        headerLeft: props => (
          <BackButton props={props} style={{ color: theme.text }} />
        ),
      }}>
      <Stack.Screen
        name={screens.Settings}
        options={{ headerTitle: t(screens.Settings) }}
        component={Settings}
      />
      <Stack.Screen
        name={screens.Languages}
        options={{
          headerTitle: t(screens.Languages),
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
        component={Languages}
      />
      <Stack.Screen
        name={screens.PushNotifications}
        options={{
          headerTitle: t(screens.PushNotifications),
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
        component={PushNotifications}
      />
    </Stack.Navigator>
  );
}
