import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { StackParamList, rootScreens } from '../../../navigation/AppWrapper';
import { colors } from '../../../utils/colors';

type RootProp = NativeStackNavigationProp<StackParamList>;

export default function SettingsButton(props: {
  tintColor?: string | undefined;
  pressColor?: string | undefined;
  pressOpacity?: number | undefined;
}) {
  const navigation = useNavigation<RootProp>();
  return (
    <Pressable
      onPress={() => navigation.navigate(rootScreens.SettingsWrapper)}
      style={({ pressed }) => [
        {
          marginRight: 15,
          padding: 8,
          borderRadius: 30,
        },
        {
          backgroundColor: pressed ? colors.gray : 'transparent',
        },
      ]}>
      <Icon name="settings" size={20} color={props.tintColor ?? colors.black} />
    </Pressable>
  );
}
