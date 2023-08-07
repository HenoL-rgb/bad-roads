import React from 'react';
import { Provider } from 'react-redux';
import AppWrapper from './pages/AppWrapper';
import { NavigationContainer } from '@react-navigation/native';
import { YANDEX_API_KEY } from '@env';
import YaMap from 'react-native-yamap';
import { store } from './store/store';
import useSetNotifications from './hooks/useSetNotifications';
import { useGetLanguage } from './hooks/useGetLanguage.hook';

function App(): JSX.Element {
  YaMap.init(YANDEX_API_KEY);
  useSetNotifications();
  useGetLanguage();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppWrapper />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
