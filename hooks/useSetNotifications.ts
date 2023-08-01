import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { checkNotifications } from 'react-native-permissions';

const useSetNotifications = () => {
  
  const requestUserPermission = async () => {
    const { status } = await checkNotifications();
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
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  };

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

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
      onDisplayNotification();
    });

    return unsubscribe;
  }, []);
};

export default useSetNotifications;
