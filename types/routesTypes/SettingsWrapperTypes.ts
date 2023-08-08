export enum screens {
  Settings = 'Settings',
  Languages = 'Languages',
  PushNotifications = 'PushNotifications',
}

export type SettingsStackParamList = {
  [screens.Settings]: undefined;
  [screens.Languages]: undefined;
  [screens.PushNotifications]: undefined;
};
