import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Login from '../pages/Login';
import Register from '../pages/Register';

export type AuthStack = {
  Login: undefined;
  Register: undefined;
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
      initialRouteName="Register">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
