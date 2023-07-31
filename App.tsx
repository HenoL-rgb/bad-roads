import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AppWrapper from './pages/AppWrapper';
import { NavigationContainer } from '@react-navigation/native';
import { YANDEX_API_KEY } from '@env';
import YaMap from 'react-native-yamap';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { store } from './store/store';

function App(): JSX.Element {
  YaMap.init(YANDEX_API_KEY);

  const requestUserPermission = async () => {
    const authStatus =
      Platform.OS === 'ios'
        ? await messaging().requestPermission()
        : Platform.OS === 'android'
        ? await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          )
        : false;

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  };

  useEffect(() => {
    requestUserPermission().then(permission => {
      if (permission) {
        messaging()
          .getToken()
          .then(token => {
            console.log(token);
          });
      } else {
        console.log('Failed token status');
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'Message handled in the background!',
        remoteMessage.notification,
      );
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppWrapper />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
