import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '../../hooks/redux-hooks';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setAuth } from '../../store/slices/user.slice';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../pages/AppWrapper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../utils/colors';

type RootProp = NativeStackNavigationProp<StackParamList>;

export default function SettingsButton(props: any) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootProp>();
  return (
    // <Pressable
    //   onPress={async () => {
    //     dispatch(setAuth(false));
    //     await EncryptedStorage.clear();
    //   }}
    //   style={{
    //     marginRight: 15,
    //   }}>
    //   <Icon name="logout" size={20} color={props.tintColor ?? '#000000'} />
    // </Pressable>
    <Pressable
      onPress={() => navigation.navigate('Settings')}
      style={({pressed}) => [{
        
        marginRight: 15,
        padding: 8,
        borderRadius: 30,
      },
      {
        backgroundColor: pressed ? colors.gray : 'transparent',
      }
      ]}>
      <Icon name="settings" size={20} color={props.tintColor ?? colors.black} />
    </Pressable>
  );
}
