import React from 'react';
import { Provider } from 'react-redux';
import AppWrapper from './pages/AppWrapper';
import { store } from './store/store';
import { NavigationContainer } from '@react-navigation/native';
import { YANDEX_API_KEY } from '@env';
import YaMap from 'react-native-yamap';

function App(): JSX.Element {  
  YaMap.init(YANDEX_API_KEY);
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppWrapper />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
