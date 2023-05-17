import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '../hooks/redux-hooks';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setAuth } from '../store/slices/user.slice';

export default function LogoutButton(props: any) {
  const dispatch = useAppDispatch();

  return (
    <Pressable
      onPress={async () => {
        dispatch(setAuth(false));
        await EncryptedStorage.clear();
      }}
      style={{
        marginRight: 15,
      }}>
      <Icon name="logout" size={20} color={props.tintColor ?? '#000000'} />
    </Pressable>
  );
}
