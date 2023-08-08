import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { checkNotifications } from 'react-native-permissions';

import { onDisplayNotification } from '../utils/onDisplayNotification';

const useSetNotifications = () => {
  const requestUserPermission = async () => {
    const { status } = await checkNotifications();
    if (status === 'blocked') {
      return false;
    }

    if (status === 'granted') {
      return true;
    }

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
      return true;
    }

    return false;
  };

  useEffect(() => {
    requestUserPermission().then(permission => {
      if (permission) {
        messaging().getToken();
      }
    });

    // Check whether an initial notification is available
    messaging().getInitialNotification();

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    // messaging().onNotificationOpenedApp(async remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    // });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await onDisplayNotification(remoteMessage.data);
    });

    return unsubscribe;
  }, []);
};

export default useSetNotifications;
