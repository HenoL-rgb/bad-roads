
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
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

function AppWrapper(): JSX.Element {
  const Tab = createBottomTabNavigator();
  const isDarkMode = useColorScheme() === 'dark';
  const {isLoading: loadRefresh} = useRefreshQuery({});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {isAuth} = useAppSelector(state => state.userReducer)

  if(loadRefresh) {
    return <Text>Loading</Text>
  }

  if(!isAuth) {
    return <AuthContainer />
  }

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default AppWrapper;
