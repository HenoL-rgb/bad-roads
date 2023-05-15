import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from '../hooks/redux-hooks';
import { setAuth } from '../store/slices/user.slice';

export default function Account() {
  const dispatch = useAppDispatch();
  return (
    <View>
      <Text>Account</Text>
      <Button
        title="Clear"
        onPress={async () => {
          dispatch(setAuth(false));
          await EncryptedStorage.clear();
        }}
      />
    </View>
  );
}
