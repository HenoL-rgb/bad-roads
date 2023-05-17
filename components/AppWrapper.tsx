import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import Account from '../pages/Account';
import AuthContainer from '../pages/AuthContainer';
import Login from '../pages/Login';
import Map from '../pages/Map';
import { useRefreshQuery } from '../store/api/auth.api';
import { setAuth, setUser } from '../store/slices/user.slice';
import Form from './Form';
import { Pressable } from 'react-native';
import LogoutButton from './LogoutButton';

export type TabNavParamList = {
  Map: {
    lat: number,
    lon: number
  };
  Account: undefined;
};

const Tab = createBottomTabNavigator<TabNavParamList>();

function AppWrapper(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const { data, isLoading: loadRefresh } = useRefreshQuery({});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const { isAuth } = useAppSelector(state => state.userReducer);

  if (loadRefresh) {
    return <Text>Loading</Text>;
  }

  if (data && !data.accessToken || !isAuth) {
    return <AuthContainer />;
  }

  return (
    <Tab.Navigator initialRouteName="Map">
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
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
          }) => (
            <LogoutButton {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppWrapper;
