import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Point } from 'react-native-yamap';

import { useAppSelector } from '../hooks/redux-hooks';
import useGetTheme from '../hooks/useGetTheme.hook';
import AuthContainer from '../navigation/AuthContainer';
import { useRefreshQuery } from '../store/api/auth.api';
import { ImageOrVideoType } from '../types/ImageType';
import { MapCurrentRoute } from '../types/Route';
import { colors } from '../utils/colors';

import Gallery from './Gallery';
import Home from './Home';
import EditRoute from './save-edit-route/EditRoute';
import SaveRoute from './save-edit-route/SaveRoute';
import SettingsWrapper from './Settings/SettingsWrapper';

export type StackParamList = {
  Home: {
    screen: 'Map' | 'Account';
  };
  SettingsWrapper: undefined;
  Gallery: {
    images: ImageOrVideoType[];
    clickedId: number;
  };
  SaveRoute: {
    points: Point[];
    currentRoute: MapCurrentRoute;
  };
  EditRoute: {
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

  const { colors: theme, dark } = useGetTheme();

  const { isAuth } = useAppSelector(state => state.userReducer);

  if (
    isError &&
    ('error' in error || ('data' in error && error.status !== 401)) &&
    isAuth === null
  ) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}>
        <Text style={{ color: theme.text }}>Server error :(</Text>
        <Pressable
          style={[styles.retryBtn, { backgroundColor: theme.border }]}
          onPress={retryConnection}>
          <Text style={{ color: theme.text }}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (loadRefresh || isAuth === null) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}>
        <ActivityIndicator size="large" color={theme.activity} />
      </SafeAreaView>
    );
  }

  if (!isAuth) {
    return <AuthContainer />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedStatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
        animated={true}
      />
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
          name="SettingsWrapper"
          component={SettingsWrapper}
          options={{
            headerBackVisible: false,
            animation: 'slide_from_right',
            headerShown: false,
          }}
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
        <RootStack.Screen
          name="EditRoute"
          component={EditRoute}
          options={{
            animation: 'fade_from_bottom',
            title: 'Edit route',
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
