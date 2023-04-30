/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react';

import { Provider } from 'react-redux';
import AppWrapper from './components/AppWrapper';
import { store } from './store/store';
import { NavigationContainer } from '@react-navigation/native';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppWrapper />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
