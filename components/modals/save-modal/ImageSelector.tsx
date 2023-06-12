import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ModalImage from './ModalImage';
import { colors } from '../../../utils/colors';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useAppSelector } from '../../../hooks/redux-hooks';
import Animated, {
    Easing,
  interpolate,
  Layout,
  runOnUI,
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
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const theme = useAppSelector(state => state.themeReducer);
  const aWidth = useDerivedValue(() => images.length * 110, [images.length]);
  const listRef = useRef<any>(null);

  function useGallery() {
    ImagePicker.openPicker({
      multiple: true,
    })
      .then(images => {
        console.log(images);
        setImages([...images]);
      })
      .catch(console.log);
  }


  const rProps = useAnimatedStyle(() => {
    return {
      minWidth: images.length > 2 ? withDelay(300, withTiming(aWidth.value, {
        duration: 300,
      })) : SCREEN_WIDTH
    };
  });

  function deleteImage(path: string) {
    const index = images.findIndex(item => item.path === path);
    setDeletedIndex(index);
    setImages(images.filter(item => item.path !== path));    
  }

  function listSizeChangeHandler() {
    if(deletedIndex !== null && images.length >= 4 && (images.length - deletedIndex <= 3)) {                
        listRef.current?.scrollToEnd({animated: true});
    }
    else if(images.length < 4) {
        listRef.current?.scrollTo({x: 0, animated: true})
    }
  }

  //console.log(aWidth.value);
  
  
  return (
    <Animated.View>
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
      <Animated.ScrollView  ref={listRef} onContentSizeChange={listSizeChangeHandler}  horizontal>
        <Animated.View style={[{flexDirection: 'row', paddingLeft: 5}, rProps]}>
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
