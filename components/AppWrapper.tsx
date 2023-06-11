import React from 'react';

import { useAppSelector } from '../hooks/redux-hooks';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Gallery from '../pages/Gallery';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from "../utils/colors";
import AuthContainer from '../navigation/AuthContainer';
import { useRefreshQuery } from '../store/api/auth.api';

export type StackParamList = {
  Home: undefined;
  Settings: undefined;
  Gallery: {
    images: ImageOrVideo[];
    clickedId: number;
  };
};

export const RootStack = createNativeStackNavigator<StackParamList>();

function AppWrapper(): JSX.Element {
  const theme = useAppSelector(state => state.themeReducer);
  const { data, isLoading: loadRefresh, isError } = useRefreshQuery({}, {});

  const { isAuth } = useAppSelector(state => state.userReducer);  

  if (loadRefresh) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if(isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Server error :(</Text>
      </View>
    );
  }

  if (!data || (isAuth === null || isAuth === false)) {
    const first = (!data.accessToken)
    console.log(isAuth);
    
    return <AuthContainer />;
  }
  return (
    <RootStack.Navigator
      screenOptions={{
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
      <RootStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerBackVisible: false, animation: 'slide_from_right' }}
      />
      <RootStack.Screen
        name="Gallery"
        component={Gallery}
        options={{ animation: 'fade_from_bottom' }}
      />
    </RootStack.Navigator>
  );
}

export default AppWrapper;
