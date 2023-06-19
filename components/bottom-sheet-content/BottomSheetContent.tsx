import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import {
  useLikeRouteMutation,
  useDislikeRouteMutation,
  useGetRouteByIdQuery,
  useApproveRouteMutation,
} from '../../store/api/routes.api';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  setApproveRoute,
  setDislike,
  setLike,
} from '../../store/slices/routes.slice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';
import { setUserDislike, setUserLike } from '../../store/slices/user.slice';
import { HOST_IP } from '../../store/api/auth.api';
import ImageBox from '../ImageBox';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../pages/AppWrapper';
import User from './User';
import Controls from './Controls';
import MarkButtons from './MarkButtons';

type RoutePopUpProps = {
  deleteRoute: (id: number) => void;
  editRoute: (id: number) => void;
  routeId: number;
};

enum Marks {
  LIKE,
  DISLIKE,
  NO_MARK,
}

function BottomSheetContent({
  editRoute,
  deleteRoute,
  routeId,
}: RoutePopUpProps) {
  const dispatch = useAppDispatch();
  const [likeRoute] = useLikeRouteMutation();
  const [dislikeRoute] = useDislikeRouteMutation();
  const [approveRoute, { isLoading: approveLoading }] =
    useApproveRouteMutation();
  const user = useAppSelector(state => state.userReducer.user);

  const { data, refetch } = useGetRouteByIdQuery(routeId, {
    skip: routeId ? false : true,
    refetchOnMountOrArgChange: true,
  });

  const likes = useAppSelector(state => state.userReducer.user?.likes);
  const dislikes = useAppSelector(state => state.userReducer.user?.dislikes);

  const [mark, setMark] = useState<Marks>(Marks.NO_MARK);

  useEffect(() => {
    const liked = likes?.some((item: { id: number }) => item.id === routeId);
    const disliked = dislikes?.some(item => item.id === routeId);
    setMark(liked ? Marks.LIKE : disliked ? Marks.DISLIKE : Marks.NO_MARK);
  }, [dislikes, likes, routeId]);

  async function handleLike() {
    if (!user) return;

    try {
      await likeRoute({ userId: user.id, routeId: routeId });

      dispatch(setUserLike({ id: routeId }));
      dispatch(setLike({ routeId: routeId, user: { id: user.id } }));
    } catch (error) {
      throw new Error('Error while like route');
    }
  }

  async function handleDislike() {
    if (!user) return;

    try {
      await dislikeRoute({ userId: user.id, routeId: routeId });
      dispatch(setUserDislike({ id: routeId }));
      dispatch(setDislike({ routeId: routeId, user: { id: user.id } }));
    } catch (error) {
      throw new Error('Error while dislike route');
    }
  }

  async function handleApprove() {
    if (!user) return;

    try {
      await approveRoute({ routeId: routeId });
      await refetch();
      dispatch(setApproveRoute({ routeId: routeId }));
    } catch (error) {
      throw new Error('Error while approve route');
    }
  }

  return (
    <>
      {data ? (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <User data={data} />
            <Controls
              approveLoading={approveLoading}
              data={data}
              routeId={routeId}
              user={user}
              editRoute={() => editRoute(routeId)}
              deleteRoute={() => deleteRoute(routeId)}
              handleApprove={handleApprove}
            />
            <MarkButtons
              handleDislike={handleDislike}
              handleLike={handleLike}
              data={data}
              mark={mark}
            />
            <ScrollView contentContainerStyle={styles.images} horizontal>
              {data.images.map((image, index) => (
                <ImageBox path={image.path} key={image.path} images={data.images} clickedId={index} />
              ))}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )}
    </>
  );
}

export default memo(BottomSheetContent);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    rowGap: 6,
  },

  images: {
    flexDirection: 'row',
    columnGap: 5,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: colors.black,
  },
});
