import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { EventType, Notification } from '@notifee/react-native';
import { checkNotifications } from 'react-native-permissions';

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

  async function onDisplayNotification(
    notification: FirebaseMessagingTypes.Notification | Notification | undefined,
  ) {
    if (notification === undefined) return;
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'Got it!',
            pressAction: {
              id: 'gotIt',
            },
          },
          {
            title: 'Dismiss',
            pressAction: {
              id: 'dismiss',
            },
          },
        ],
      },
    });
  }

  useEffect(() => {
    requestUserPermission().then(permission => {
      if (permission) {
        messaging().getToken();
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

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      
      // Check if the user pressed the "Mark as read" action
      if(type === EventType.ACTION_PRESS && pressAction?.id === 'dismiss'){
        if(notification === undefined || notification.id === undefined) return;
        console.log(notification.id);
        await notifee.cancelNotification(notification.id)
        
      }
      
    });


    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      onDisplayNotification(remoteMessage.notification);
    });

    return unsubscribe;
  }, []);
};

export default useSetNotifications;
