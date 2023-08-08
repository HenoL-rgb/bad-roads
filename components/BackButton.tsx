import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { StackParamList } from '../pages/AppWrapper';
import { colors } from '../utils/colors';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type RootProp = NativeStackNavigationProp<StackParamList>;

type BackButtonProps = {
  props: HeaderButtonProps;
  style: object;
};

export default function BackButton({ props, style }: BackButtonProps) {
  const navigation = useNavigation<RootProp>();
  return (
    <Pressable
      onPress={() => navigation.goBack()}
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
      <AnimatedIcon
        name="arrow-back"
        size={24}
        {...props}
        style={[{ justifyContent: 'center' }, style]}
      />
    </Pressable>
  );
}
