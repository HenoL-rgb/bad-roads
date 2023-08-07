import { useEffect } from 'react';
import i18next from 'i18next';
import EncryptedStorage from 'react-native-encrypted-storage';
import { NativeModules, Platform } from 'react-native';

export const useGetLanguage = () => {
  useEffect(() => {
    async function getLng() {
      const lng = await EncryptedStorage.getItem('lng');
      if (lng) {
        i18next.changeLanguage(lng);
        return;
      }
      const getDeviceLang = () => {
        const appLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0]
            : NativeModules.I18nManager.localeIdentifier;
      
        return appLanguage.search(/-|_/g) !== -1
          ? appLanguage.slice(0, 2)
          : appLanguage;
      };
      
      const systemLng = getDeviceLang();
      i18next.changeLanguage(systemLng);
    }
    getLng();
  }, []);
};
