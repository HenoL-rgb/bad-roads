import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  PressableStateCallbackType,
} from 'react-native';
import React, { useState } from 'react';
import ModalImage from './ModalImage';
import { colors } from '../../../utils/colors';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import Animated, { Layout } from 'react-native-reanimated';

export default function ImageSelector() {
  const [images, setImages] = useState<ImageOrVideo[]>([]);

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

  function deleteImage(path: string) {
    setImages(images.filter(item => item.path !== path));
  }

  return (
    <View>
      <Text style={[styles.text, { marginBottom: 10, paddingLeft: 5 }]}>
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingRight: 110 }}
        horizontal>
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
      </ScrollView>

      <Pressable
        onPress={useGallery}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? colors.eyePress : 'transparent',
          },
          styles.cancelBtn,
          styles.selectBtn,
        ]}>
        <Text style={{ color: colors.black }}>SELECT</Text>
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
