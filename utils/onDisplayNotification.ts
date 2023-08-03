
import notifee, { Notification } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export async function onDisplayNotification(
    notification: any
  ) {
    
    if (notification === undefined) return;
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    console.log('background display');

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