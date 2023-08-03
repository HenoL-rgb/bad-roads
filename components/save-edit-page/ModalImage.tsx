import { Image, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../pages/AppWrapper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeOutLeft, Layout, ZoomIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

type ModalImageProps = {
  images: ImageOrVideo[] | { path: string }[];
  clickedId: number;
  image: ImageOrVideo | { path: string };
  deleteImage: (path: string) => void;
};

type Props = NativeStackNavigationProp<StackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ModalImage({
  images,
  clickedId,
  image,
  deleteImage,
}: ModalImageProps) {
  const navigation = useNavigation<Props>();

  return (
    <AnimatedPressable
      exiting={FadeOutLeft.duration(100)}
      entering={ZoomIn.delay(100 * clickedId)}
      layout={Layout.delay(120)}
      style={styles.pressable}
      onPress={() =>
        navigation.navigate('Gallery', {
          images: images,
          clickedId: clickedId,
        })
      }>
      <Image source={{ uri: image.path }} style={styles.image} />
      <Pressable style={styles.cancel} onPress={() => deleteImage(image.path)}>
        <Icon name="close" size={11} color={colors.white} />
      </Pressable>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    position: 'relative',
    padding: 5,
  },

  image: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cancel: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: colors.red,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    right: 1,
    top: 1,
  },
});
