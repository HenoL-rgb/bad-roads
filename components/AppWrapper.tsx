import React from 'react';

import { useAppSelector } from '../hooks/redux-hooks';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Settings from '../pages/Settings';

export type StackParamList = {
  Home: undefined;
  Setting: undefined;
};

export const RootStack = createNativeStackNavigator<StackParamList>();

function AppWrapper(): JSX.Element {
  const theme = useAppSelector(state => state.themeReducer);
  return (
    <RootStack.Navigator screenOptions={{
      animation: 'slide_from_right',
      animationDuration: 100, // not working
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTitleStyle: {
        color: theme.colors.text,
      },
      headerTintColor: theme.colors.text,
    }}>
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen name="Setting" component={Settings} />
    </RootStack.Navigator>
  );
}

export default AppWrapper;
