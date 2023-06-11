import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppSelector } from '../hooks/redux-hooks';
import Account from '../pages/Account';
import AuthContainer from '../navigation/AuthContainer';
import Map from '../pages/Map';
import { useRefreshQuery } from '../store/api/auth.api';
import useGetTheme from '../hooks/useGetTheme.hook';
import SettingsButton from '../components/SettingsButton';
import { colors } from '../utils/colors';

export type TabNavParamList = {
  Map: {
    lat: number;
    lon: number;
  };
  Account: undefined;
};

export const Tab = createBottomTabNavigator<TabNavParamList>();



function Home(): JSX.Element {
  const { colors: theme } = useGetTheme();
  
  return (
    <Tab.Navigator initialRouteName="Map" screenOptions={{
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
    }}>
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          unmountOnBlur: true,
          headerShown: false,
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
        name="Account"
        component={Account}
        options={{
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
