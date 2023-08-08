import { Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import ModalImage from './ModalImage';
import { colors } from '../../../utils/colors';
import ImagePicker from 'react-native-image-crop-picker';
import { useAppSelector } from '../../../hooks/redux-hooks';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ImageType } from '../../../types/ImageType';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ImageSelectorProps = {
  images: ImageType[];
  setImages: (images: ImageType[]) => void;
};

export default function ImageSelector({
  images,
  setImages,
}: ImageSelectorProps) {
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const theme = useAppSelector(state => state.themeReducer);
  const aWidth = useDerivedValue(() => images.length * 110, [images.length]);
  const listRef = useRef<Animated.ScrollView>(null);
  const translationX = useSharedValue(0);
  const aHeight = useDerivedValue(() => (images.length ? 110 : 0));

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationX.value = event.contentOffset.x;
  });

  function useGallery() {
    'worklet';
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    })
      .then(images => {
        setImages([...images]);
      })
      .catch(console.log);
  }

  const rProps = useAnimatedStyle(() => {
    return {
      minWidth:
        images.length > 2
          ? withDelay(
              300,
              withTiming(aWidth.value, {
                duration: 300,
              }),
            )
          : SCREEN_WIDTH,
      height: withTiming(aHeight.value, {
        duration: 300,
      }),
    };
  });

  function deleteImage(path: string) {
    const index = images.findIndex(item => item.path === path);
    setDeletedIndex(index);
    setImages(images.filter(item => item.path !== path));
  }

  function listSizeChangeHandler() {
    if (
      deletedIndex !== null &&
      images.length >= 4 &&
      images.length - deletedIndex < 3 &&
      translationX.value > SCREEN_WIDTH / 2.85
    ) {
      listRef.current?.scrollToEnd({ animated: true });
    } else if (images.length < 4) {
      listRef.current?.scrollTo({ x: 0, animated: true });
    }
  }

  return (
    <Animated.View>
      <Text
        style={[
          styles.text,
          { marginBottom: 10, paddingLeft: 5, color: theme.colors.text },
        ]}>
        Images:
      </Text>
      <Animated.ScrollView
        ref={listRef}
        onContentSizeChange={listSizeChangeHandler}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        horizontal>
        <Animated.View
          style={[{ flexDirection: 'row', paddingLeft: 5 }, rProps]}>
          {images.map((item, index) => {
            return (
              <ModalImage
                image={item}
                images={images}
                clickedId={index}
                deleteImage={deleteImage}
                key={item.path}
              />
            );
          })}
        </Animated.View>
      </Animated.ScrollView>

      <Pressable
        onPress={useGallery}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? colors.eyePress : 'transparent',
          },
          styles.cancelBtn,
          styles.selectBtn,
        ]}>
        <Text style={{ color: theme.colors.text }}>SELECT</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    fontSize: 18,
  },

  imagesWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfdfdf55',
    borderRadius: 10,
    height: 100,
  },

  cancelBtn: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtn: {
    marginTop: 3,
    width: 100,
  },
});
