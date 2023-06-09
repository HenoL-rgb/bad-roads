import {
  Text,
  SafeAreaView,
  View,
  Switch,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStack, StackParamList } from '../components/AppWrapper';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { ViewToken } from '@shopify/flash-list';
import { DarkTheme } from '@react-navigation/native';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import GalleryImage from '../components/GalleryImage';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = NativeStackScreenProps<StackParamList, 'Gallery'>;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Gallery({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const { images, clickedId } = route.params;
  const [currentImage, setCurrentImage] = useState(clickedId);


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
    setCurrentImage(viewableItems[0].index ?? 0);
  }).current;

  const renderItem = useCallback(({ item }: any) => {
    return (
      <GalleryImage image={item} />
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <FlatList
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        scrollEventThrottle={32}
        keyExtractor={item => item.path}
        onViewableItemsChanged={viewableItemsChanged}
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
