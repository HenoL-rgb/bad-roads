/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useRef, useState } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  DrivingInfo,
  Marker,
  Polyline,
  RoutesFoundEvent,
  YaMap,
} from 'react-native-yamap';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import Account from '../pages/Account';
import Map from '../pages/Map';
import { useTestMutation } from '../store/api/auth.api';
import { store } from '../store/store';

function AppWrapper(): JSX.Element {
  const Tab = createBottomTabNavigator();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  marker: {
    height: 40,
    width: 20,
    position: 'relative',
  },
  markerBottom: {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    bottom: 18,
    left: 5,
  },
  markerTop: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 50,
    position: 'absolute',
  },
});

export default AppWrapper;
