import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Account from './Account/Account';
import Map from './Map/Map';
import useGetTheme from '../hooks/useGetTheme.hook';
import SettingsButton from './Account/components/SettingsButton';
import { useTranslation } from 'react-i18next';

export enum HomeScreens {
  Map = "Map",
  Account = "Account"
}

export type TabNavParamList = {
  [HomeScreens.Map]: {
    lat: number;
    lon: number;
  };
  [HomeScreens.Account]: undefined;
};

export const Tab = createBottomTabNavigator<TabNavParamList>();

function Home(): JSX.Element {
  const { colors: theme } = useGetTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName={HomeScreens.Map}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        tabBarActiveTintColor: theme.text,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.text,
        //tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={HomeScreens.Map}
        component={Map}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabel: t(HomeScreens.Map),
          tabBarIcon: (props: {
            focused: boolean;
            color: string;
            size: number;
          }) => <Icon name="explore" size={20} color={props.color} />,
        }}
        initialParams={{
          lat: 55.17,
          lon: 30.2153,
        }}
      />
      <Tab.Screen
        name={HomeScreens.Account}
        component={Account}
        options={{
          headerTitle: t(HomeScreens.Account),
          tabBarLabel: t(HomeScreens.Account),
          tabBarIcon: (props: {
            focused: boolean;
            color: string;
            size: number;
          }) => <Icon name="person" size={18} color={props.color} />,
          headerRight: (props: {
            tintColor?: string | undefined;
            pressColor?: string | undefined;
            pressOpacity?: number | undefined;
          }) => <SettingsButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default Home;
