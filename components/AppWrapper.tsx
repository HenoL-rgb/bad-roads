import React from 'react';

import { useAppSelector } from '../hooks/redux-hooks';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Settings from '../pages/Settings';

export type StackParamList = {
  Home: undefined;
  Settings: undefined;
};

export const RootStack = createNativeStackNavigator<StackParamList>();

function AppWrapper(): JSX.Element {
  const theme = useAppSelector(state => state.themeReducer);
  return (
    <RootStack.Navigator screenOptions={{
      animation: 'slide_from_right',
      animationDuration: 100, // not working
   
    }}>
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <RootStack.Screen name="Settings" component={Settings} options={{headerBackVisible: false}} />
    </RootStack.Navigator>
  );
}

export default AppWrapper;
