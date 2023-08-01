import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
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
import { colors } from '../../utils/colors';
import { setUserDislike, setUserLike } from '../../store/slices/user.slice';
import ImageBox from '../ImageBox';
import FastInfoType from './FastInfoType';
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
  const theme = useAppSelector(state => state.themeReducer);

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
    if (!user || !data) return;

    try {
      
      await approveRoute({ routeId: routeId, userId: data.author.id });
      await refetch();
      dispatch(setApproveRoute({ routeId: routeId, userId: data.author.id }));
    } catch (error) {
      throw new Error('Error while approve route');
    }
  }

  return (
    <>
      {data ? (
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: theme.colors.background,
              },
            ]}>
            <View
              style={[
                styles.header,
                {
                  backgroundColor: theme.colors.card,
                },
              ]}>
              <FastInfoType data={data} />
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
            </View>
            <View style={[
                styles.images,
                { backgroundColor: theme.colors.card },
              ]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
              horizontal>
              {data.images.map((image, index) => (
                <ImageBox
                  path={image.path}
                  key={image.path}
                  images={data.images}
                  clickedId={index}
                />
              ))}
            </ScrollView>
            </View>
            
            <View
              style={[
                styles.description,
                { backgroundColor: theme.colors.card },
              ]}>
              <Text
                style={[styles.descriptionTitle, { color: theme.colors.text }]}>
                Description
              </Text>
              <ScrollView>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                  {data.description}
                </Text>
              </ScrollView>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.centeredView}>
          <ActivityIndicator
            size="large"
            color={colors.blue}
            style={{ marginTop: 20 }}
          />
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
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    rowGap: 6,
  },

  header: {
    padding: 5,
    borderRadius: 5,
  },

  images: {
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },

  imagesContainer: {
    columnGap: 3,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    paddingLeft: 2,
    fontSize: 16,
    color: colors.black,
  },
  description: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    maxHeight: 250,
    backgroundColor: colors.eyePress,
    justifyContent: 'flex-start',
  },
  descriptionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
