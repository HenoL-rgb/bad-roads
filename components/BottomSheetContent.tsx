import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import {
  useLikeRouteMutation,
  useDislikeRouteMutation,
  useGetRouteByIdQuery,
  useApproveRouteMutation,
} from '../store/api/routes.api';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setDislike, setLike } from '../store/slices/routes.slice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../utils/colors';
import { setUserDislike, setUserLike } from '../store/slices/user.slice';

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
  const [likeRoute, { isLoading: likeLoading }] = useLikeRouteMutation();
  const [dislikeRoute, { isLoading: dislikeLoading }] =
    useDislikeRouteMutation();
  const [approveRoute, { isLoading: approveLoading }] =
    useApproveRouteMutation();
  const user = useAppSelector(state => state.userReducer.user);
  
  const isAdmin = user
    ? user.roles.some(
        (role: { value: string; description: string }) =>
          role.value === 'ADMIN',
      )
    : false;

  const { data, refetch, isLoading } = useGetRouteByIdQuery(routeId, {
    skip: routeId ? false : true,
    refetchOnMountOrArgChange: true,
  });  

  const likes = useAppSelector(state => state.userReducer.user?.likes);
  const dislikes = useAppSelector(state => state.userReducer.user?.dislikes);

  const [mark, setMark] = useState(Marks.NO_MARK);

  useEffect(() => {
    const liked = likes?.some((item: { id: number }) => item.id === routeId);
    const disliked = dislikes?.some(item => item.id === routeId);
    setMark(liked ? Marks.LIKE : disliked ? Marks.DISLIKE : Marks.NO_MARK);
  }, [dislikes, likes, routeId]);

  async function handleLike() {
    if (!user) return;

    try {
      const res = await likeRoute({ userId: user.id, routeId: routeId });
      
      dispatch(setUserLike({id: routeId}))
      dispatch(setLike({ routeId: routeId, user: {id: user.id} }));
    } catch (error) {
      throw new Error('Error while like route')
    }
  }

  async function handleDislike() {
    if (!user) return;

    try {
      const res = await dislikeRoute({ userId: user.id, routeId: routeId });
      console.log(res);
      dispatch(setUserDislike({id: routeId}))
      dispatch(setDislike({ routeId: routeId, user: {id: user.id} }));
    } catch (error) {
      throw new Error('Error while dislike route')
    }
  }

  async function handleApprove() {
    if (!user) return;

    try {
      const res = await approveRoute({ routeId: routeId });
      console.log(res);
      
      await refetch();
    } catch (error) {
      throw new Error('Error while approve route')
    }
  }

  return (
    <>
      {data ? (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <View style={styles.sign}>
                {data.isApproved ? (
                  <>
                  <View style={styles.fillBg}></View>
                    <Icon
                      name="verified"
                      size={24}
                      color={colors.verified}
                      style={styles.approved}
                    />
                  </>
                ) : (
                  <View style={styles.notApproved}></View>
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.modalText}>{data.author.email}</Text>
              </View>
            </View>

            <View style={styles.routeControls}>
              {(isAdmin ||
                (data.author.email === user?.email && !data.isApproved)) && (
                <>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => editRoute(routeId)}>
                    <Icon name="edit" size={24} color={colors.gray} />
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => deleteRoute(routeId)}>
                    <Icon name="delete" size={24} color={colors.gray} />
                  </Pressable>
                </>
              )}
              {isAdmin && (
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { opacity: data.isApproved ? 0.4 : 1 },
                  ]}
                  disabled={data.isApproved}
                  onPress={handleApprove}>
                  {approveLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Icon name="done" size={24} color={colors.gray} />
                  )}
                </Pressable>
              )}
            </View>
            <View style={styles.markButtonsContainer}>
              <Pressable
                style={[
                  styles.likeButton,
                  { opacity: data.isApproved ? 1 : 0.5 },
                ]}
                onPress={handleLike}
                disabled={!data.isApproved}>
                <Icon
                  name={mark === Marks.LIKE ? 'thumb-up' : 'thumb-up-off-alt'}
                  size={24}
                  color={colors.white}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.dislikeButton,
                  { opacity: data.isApproved ? 1 : 0.5 },
                ]}
                onPress={handleDislike}
                disabled={!data.isApproved}>
                <Icon
                  name={
                    mark === Marks.DISLIKE ? 'thumb-down' : 'thumb-down-off-alt'
                  }
                  size={24}
                  color={colors.white}
                />
              </Pressable>
            </View>
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
  fillBg: {
    height: 10,
    width: 12,
    backgroundColor: 'white',
    position: 'absolute',
    right: -4,
    bottom: -2,
  },
  header: {
    flexDirection: 'row',
    columnGap: 10,
  },
  info: {},

  approved: {
    position: 'absolute',
    right: -10,
    bottom: -8,
  },
  notApproved: {
    height: 15,
    width: 15,
    backgroundColor: colors.gray,
    borderRadius: 10,
    position: 'absolute',
    right: -4,
    bottom: -4,
  },
  sign: {
    width: 60,
    height: 60,
    backgroundColor: 'pink',
    position: 'relative',
  },
  routeControls: {
    flexDirection: 'row',
    columnGap: 10,
  },
  markButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 15,
    marginBottom: 15,
  },
  button: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
    borderWidth: 1,
  },
  likeButton: {
    borderRadius: 24,
    padding: 10,
    backgroundColor: colors.lime,
  },
  dislikeButton: {
    borderRadius: 24,
    padding: 10,
    backgroundColor: colors.red,
  },
 
  buttonClose: {},
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
