import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import ModalImage from './ModalImage';
import { colors } from '../../../utils/colors';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useAppSelector } from '../../../hooks/redux-hooks';
import Animated, {
  interpolate,
  Layout,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const AScrollView = Animated.createAnimatedComponent(ScrollView);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageSelector() {
  const [images, setImages] = useState<ImageOrVideo[]>([]);
  const theme = useAppSelector(state => state.themeReducer);
  const sharedImages = useSharedValue<ImageOrVideo[]>([]);
  const aWidth = useDerivedValue(
    () => sharedImages.value.length * 110,
    [sharedImages.value],
  );
  function useGallery() {
    'worklet';
    ImagePicker.openPicker({
      multiple: true,
    })
      .then(images => {
        console.log(images);
        sharedImages.value = images;
        setImages([...images]);
      })
      .catch(console.log);
  }

  const rProps = useAnimatedProps(() => {
    console.log(aWidth);

    return {
      minWidth: withDelay(
        300,
        withTiming(aWidth.value, {
          duration: 300,
        }),
      ),
    };
  });

  function deleteImage(path: string) {
    'worklet';
    console.log(path);
    sharedImages.value = sharedImages.value.filter(item => item.path !== path);
    setImages(images.filter(item => item.path !== path));
  }

  return (
    <View>
      <Text
        style={[
          styles.text,
          { marginBottom: 10, paddingLeft: 5, color: theme.colors.text },
        ]}>
        Images:
      </Text>
      {/* <Animated.FlatList
        data={images}
        horizontal
        itemLayoutAnimation={Layout.delay(300)}
        renderItem={({ item, index }) => (
          <ModalImage
            image={item}
            images={images}
            clickedId={index}
            deleteImage={deleteImage}
            
          />
        )}
        keyExtractor={item => item.path}
        
        
      /> */}
      <Animated.ScrollView
        contentContainerStyle={{flex: 1}}
        showsHorizontalScrollIndicator={false}
        horizontal>
        <Animated.View style={[{ flexDirection: 'row' }, rProps]}>
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
    </View>
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
