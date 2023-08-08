/**
 * @format
 */
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';

import './i18n';
import App from './App';
import { name as appName } from './app.json';
import { onDisplayNotification } from './utils/onDisplayNotification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await onDisplayNotification(remoteMessage.data);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction?.id === 'dismiss') {
    if (notification === undefined || notification.id === undefined) return;
    await notifee.cancelNotification(notification.id);
  }
});
AppRegistry.registerComponent(appName, () => App);
