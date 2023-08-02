import React from 'react';

import { useAppSelector } from '../hooks/redux-hooks';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Settings from './Settings';
import Gallery from './Gallery';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import {
  View,
  ActivityIndicator,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Point } from 'react-native-yamap';
import { MapCurrentRoute } from '../types/Route';
import { colors } from '../utils/colors';
import AuthContainer from '../navigation/AuthContainer';
import { useRefreshQuery } from '../store/api/auth.api';
import SaveRoute from './save-edit-route/SaveRoute';
import useGetTheme from '../hooks/useGetTheme.hook';

export type StackParamList = {
  Home: {
    screen: 'Map' | 'Account'
  };
  Settings: undefined;
  Gallery: {
    images: ImageOrVideo[] | {path: string}[];
    clickedId: number;
  };
  SaveRoute: {
    points: Point[];
    currentRoute: MapCurrentRoute;
  };
};

export const RootStack = createNativeStackNavigator<StackParamList>();

export type IError = {
  data: {
    message: string;
  },
  status: number;
}

function AppWrapper(): JSX.Element {
  const {
    isLoading: loadRefresh,
    error,
    isError,
    refetch: retryConnection,
  } = useRefreshQuery({}, {});

  const { colors: theme } = useGetTheme();


  const { isAuth } = useAppSelector(state => state.userReducer);
  
  if (isError && ("error" in error || 'data' in error && error.status !== 401) && isAuth === null) {
    
    return (
      <View style={styles.container}>
        <Text>Server error :(</Text>
        <Pressable style={styles.retryBtn} onPress={retryConnection}>
          <Text>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (loadRefresh || isAuth === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!isAuth) {
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
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
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
      <RootStack.Screen
        name="SaveRoute"
        component={SaveRoute}
        options={{
          animation: 'fade_from_bottom',
          title: 'Save route',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
        }}
      />
    </RootStack.Navigator>
  );
}

export default AppWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: colors.eyePress,
  },
});
