import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import { Icon } from 'react-native-elements';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import ImageSelector from '../components/modals/save-modal/ImageSelector';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import {
  useGetAllRoutesQuery,
  useSaveRouteMutation,
  useUpdateRouteMutation,
} from '../store/api/routes.api';
import { getUrl } from '../utils/getUrl';
import { colors } from '../utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './AppWrapper';
import { setInitialState } from '../store/slices/routes.slice';

type SaveRouteProps = NativeStackScreenProps<StackParamList, 'SaveRoute'>;

export default function SaveRoute({ navigation, route }: SaveRouteProps) {
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
  const [updateRoute, { isLoading: updateLoading }] = useUpdateRouteMutation();
  const progress = useSharedValue(1.15);
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const { points, currentRoute } = route.params;
  const theme = useAppSelector(state => state.themeReducer);
  const { refetch } = useGetAllRoutesQuery({});
  const dispatch = useAppDispatch();

  async function handleSaveRoute(): Promise<void> {
    if (!userId) return;
    getUrl(points);

    if (currentRoute.id) {
      const response = await updateRoute({
        points,
        icon: getUrl(points),
        id: currentRoute.id,
      });
      console.log(response);
    } else {
      console.log(points);

      const response = await saveRoute({
        route: points,
        icon: getUrl(points),
        userId: userId,
      });
      console.log(response);
      dispatch(setInitialState());
      await refetch()
    }
    navigation.navigate('Home', {
        screen: 'Map'
    })
  }

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: progress.value }],
    };
  });

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [progress]);

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.saveIconWrapper]}>
        <Animated.View style={[styles.saveIcon, reanimatedStyle]}>
          <Icon name="save" size={50} color={colors.blue} />
        </Animated.View>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.obstacleType}>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Type:
            </Text>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: colors.darkRed,
                borderRadius: 10,
              }}></View>
          </View>
        </View>

        <View style={styles.section}>
          <ImageSelector />
        </View>
      </ScrollView>
      <View style={styles.textWrapper}>
        <Text
          style={[styles.text, { color: theme.colors.text }]}>
          Save route?
        </Text>
      </View>
      <View style={styles.buttons}>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={[{color: theme.colors.text }]}>CANCEL</Text>
        </Pressable>
        <Pressable
          style={[styles.cancelBtn, styles.saveBtn, {backgroundColor: theme.colors.text}]}
          onPress={handleSaveRoute}>
          {saveLoading || updateLoading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Text style={[{ color: theme.colors.card }]}>SAVE</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 5,
  },
  content: {
    minHeight: 200,
    maxHeight: 300,
  },
  contentContainer: {
    rowGap: 10,
  },
  obstacleType: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  saveIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
  saveIcon: {
    padding: 20,
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 50,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfdfdf55',
    borderRadius: 10,
    height: 100,
  },
  text: {
    color: colors.black,
    fontSize: 18,
    paddingLeft: 3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  saveBtn: {
    backgroundColor: colors.blue,
    width: 90,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
