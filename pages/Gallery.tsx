import { StyleSheet, FlatList, Dimensions, Pressable, Text } from 'react-native';
import React, {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './AppWrapper';
import { DarkTheme, useFocusEffect } from '@react-navigation/native';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GalleryImage from '../components/GalleryImage';
import { ImageOrVideo } from 'react-native-image-crop-picker';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = NativeStackScreenProps<StackParamList, 'Gallery'>;

export default function Gallery({ navigation, route }: Props) {
  const { images, clickedId } = route.params;
  const [currentImage, setCurrentImage] = useState(clickedId);
  const listRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${currentImage + 1} / ${images.length}`,
      headerStyle: {
        backgroundColor: DarkTheme.colors.background,
      },
      headerTitleStyle: {
        color: colors.white,
      },
      headerLeft: props => (
        <AnimatedIcon
          name="arrow-back"
          style={[
            { paddingRight: 20, justifyContent: 'center', color: colors.white },
          ]}
          size={24}
          {...props}
          onPress={() => navigation.goBack()}></AnimatedIcon>
      ),
    });
  }, [currentImage, images.length, navigation]);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => { 
      setCurrentImage(viewableItems[0].index);
  }).current;

  const renderItem = useCallback(({ item }: any) => {
    return <GalleryImage image={item} />;
  }, []);

  return ( 
    <GestureHandlerRootView style={styles.wrapper}>
      <FlatList
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        initialScrollIndex={clickedId}
        scrollEventThrottle={32}
        keyExtractor={item => item.path}
        onViewableItemsChanged={viewableItemsChanged}
        ref={listRef}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: DarkTheme.colors.card,
  },
  text: {
    fontSize: 18,
  },
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
});
