import { YANDEX_API_KEY } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import YaMap from 'react-native-yamap';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import LoadingPage from './components/LoadingPage';
import { useGetLanguage } from './hooks/useGetLanguage.hook';
import useSetNotifications from './hooks/useSetNotifications';
import AppWrapper from './navigation/AppWrapper';
import { persistor, store } from './store/store';

function App(): JSX.Element {
  YaMap.init(YANDEX_API_KEY);
  useSetNotifications();
  useGetLanguage();

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingPage />} persistor={persistor}>
        <NavigationContainer>
          <AppWrapper />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
