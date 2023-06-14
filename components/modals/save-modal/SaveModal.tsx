import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../../../hooks/redux-hooks';
import {
  useSaveRouteMutation,
  useUpdateRouteMutation,
} from '../../../store/api/routes.api';
import { Point } from '../../../types/Point';
import { MapCurrentRoute } from '../../../types/Route';
import { getUrl } from '../../../utils/getUrl';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import {
  QueryDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import Modal, { ModalRefProps } from '../Modal';
import { Icon } from 'react-native-elements';
import { colors } from '../../../utils/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { StackParamList } from '../../../pages/AppWrapper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ModalImage from './ModalImage';
import ImageSelector from '../../../pages/save-route/ImageSelector';

type SaveModalProps = {
  points: Point[];
  currentRoute: MapCurrentRoute;
  modalRef: React.RefObject<ModalRefProps>;
  closeRouteWork: () => void;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      unknown,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        object
      >,
      never,
      unknown,
      'routesApi'
    >
  >;
};

type Props = NativeStackNavigationProp<StackParamList>;

export default function SaveModal({
  points,
  currentRoute,
  closeRouteWork,
  refetch,
  modalRef,
}: SaveModalProps) {
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
  const [updateRoute, { isLoading: updateLoading }] = useUpdateRouteMutation();
  const progress = useSharedValue(1.15);
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const navigate = useNavigation<Props>();

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
    }
    await refetch();
    modalRef.current?.setActive(false);
    closeRouteWork();
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
    <Modal ref={modalRef}>
      <View style={styles.wrapper}>
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
              <Text style={styles.text}>Type:</Text>
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
            style={{ color: colors.black, fontSize: 18, textAlign: 'center' }}>
            Save route?
          </Text>
        </View>
        <View style={styles.buttons}>
          <Pressable
            onPress={() => modalRef.current?.setActive(false)}
            style={styles.cancelBtn}>
            <Text style={{ color: colors.black }}>CANCEL</Text>
          </Pressable>
          <Pressable
            style={[styles.cancelBtn, styles.saveBtn]}
            onPress={handleSaveRoute}>
            {saveLoading || updateLoading ? (
              <ActivityIndicator size={'small'} color={colors.white} />
            ) : (
              <Text style={{ color: colors.white }}>SAVE</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
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
