import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Login from '../pages/Login';
import Register from '../pages/Register';

export enum authScreens {
  Login = 'Login',
  Register = 'Register',
}

export type AuthStack = {
  [authScreens.Login]: undefined;
  [authScreens.Register]: undefined;
};
const Stack = createNativeStackNavigator<AuthStack>();

export default function AuthContainer() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 600,
      }}
      initialRouteName={authScreens.Login}>
      <Stack.Screen name={authScreens.Login} component={Login} />
      <Stack.Screen name={authScreens.Register} component={Register} />
    </Stack.Navigator>
  );
}
