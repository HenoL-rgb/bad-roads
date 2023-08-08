import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import { StackParamList } from '../navigation/AppWrapper';

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
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 5,
    width: 150,
    height: 150,
  },
});
