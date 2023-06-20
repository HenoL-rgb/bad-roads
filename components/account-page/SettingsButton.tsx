import { Pressable } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../pages/AppWrapper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../utils/colors';

type RootProp = NativeStackNavigationProp<StackParamList>;

export default function SettingsButton(props: any) {
  const navigation = useNavigation<RootProp>();
  return (
    
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
