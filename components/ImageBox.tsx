import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../pages/AppWrapper';
import { ImageOrVideo } from 'react-native-image-crop-picker';

type ImageBoxProps = {
  path: string;
  images: { path: string }[];
  clickedId: number;
};
type Props = NativeStackNavigationProp<StackParamList>;

export default function ImageBox({ path, images, clickedId }: ImageBoxProps) {
  const navigation = useNavigation<Props>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Gallery', {
          images: images,
          clickedId: clickedId,
        })
      }>
      <Image
        source={{
          uri: path,
        }}
        style={{
          borderRadius: 5,
          width: 150,
          height: 150,
        }}
      />
    </Pressable>
  );
}
