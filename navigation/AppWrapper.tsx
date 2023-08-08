import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Point } from 'react-native-yamap';

import { useAppSelector } from '../hooks/redux-hooks';
import useGetTheme from '../hooks/useGetTheme.hook';
import ServerError from '../pages/Account/components/ServerError';
import Gallery from '../pages/Gallery';
import Home from '../pages/Home';
import EditRoute from '../pages/save-edit-route/EditRoute';
import SaveRoute from '../pages/save-edit-route/SaveRoute';
import { useRefreshQuery } from '../store/api/auth.api';
import { ImageOrVideoType } from '../types/ImageType';
import { MapCurrentRoute } from '../types/Route';

import AuthContainer from './AuthContainer';
import SettingsWrapper from './SettingsWrapper';

export enum rootScreens {
  Home = 'Home',
  SettingsWrapper = 'SettingsWrapper',
  Gallery = 'Gallery',
  SaveRoute = 'SaveRoute',
  EditRoute = 'EditRoute',
}

export type StackParamList = {
  [rootScreens.Home]: {
    screen: 'Map' | 'Account';
  };
  [rootScreens.SettingsWrapper]: undefined;
  [rootScreens.Gallery]: {
    images: ImageOrVideoType[];
    clickedId: number;
  };
  [rootScreens.SaveRoute]: {
    points: Point[];
    currentRoute: MapCurrentRoute;
  };
  [rootScreens.EditRoute]: {
    points: Point[];
    currentRoute: MapCurrentRoute;
  };
};

export const RootStack = createNativeStackNavigator<StackParamList>();

export type IError = {
  data: {
    message: string;
  };
  status: number;
};

const AnimatedStatusBar = Animated.createAnimatedComponent(StatusBar);

function AppWrapper(): JSX.Element {
  const {
    isLoading: loadRefresh,
    error,
    isError,
    refetch: retryConnection,
  } = useRefreshQuery({}, {});

  const theme = useGetTheme();

  const { isAuth } = useAppSelector(state => state.userReducer);

  if (
    isError &&
    ('error' in error || ('data' in error && error.status !== 401)) &&
    isAuth === null
  ) {
    return <ServerError retryConnection={retryConnection} theme={theme} />;
  }

  if (loadRefresh || isAuth === null) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}>
        <ActivityIndicator size="large" color={theme.colors.activity} />
      </SafeAreaView>
    );
  }

  if (!isAuth) {
    return <AuthContainer />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedStatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        animated={true}
      />
      <RootStack.Navigator
        screenOptions={{
          animationDuration: 100, // not working
        }}>
        <RootStack.Screen
          name={rootScreens.Home}
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
          name={rootScreens.SettingsWrapper}
          component={SettingsWrapper}
          options={{
            headerBackVisible: false,
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name={rootScreens.Gallery}
          component={Gallery}
          options={{ animation: 'fade_from_bottom' }}
        />
        <RootStack.Screen
          name={rootScreens.SaveRoute}
          component={SaveRoute}
          options={{
            animation: 'fade_from_bottom',
            title: 'Save route',
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
          name={rootScreens.EditRoute}
          component={EditRoute}
          options={{
            animation: 'fade_from_bottom',
            title: 'Edit route',
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.text,
            },
            headerTintColor: theme.colors.text,
          }}
        />
      </RootStack.Navigator>
    </SafeAreaView>
  );
}

export default AppWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
