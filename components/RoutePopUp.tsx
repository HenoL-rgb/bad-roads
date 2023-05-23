import {
  View,
  Text,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import {
  useLikeRouteMutation,
  useDislikeRouteMutation,
  useGetRouteByIdQuery,
} from '../store/api/routes.api';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { setDislike, setLike } from '../store/slices/user.slice';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RoutePopUpProps = {
  modalVisible: boolean;
  hideModal: () => void;
  deleteRoute: (id: number) => void;
  editRoute: (id: number) => void;
  routeId: number;
  refetchRoutes: () => QueryActionCreatorResult<
    QueryDefinition<
      any,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        object
      >,
      never,
      any,
      'routesApi'
    >
  >;
};

enum Marks {
  LIKE,
  DISLIKE,
  NO_MARK,
}

function RoutePopUp({
  modalVisible,
  hideModal,
  editRoute,
  deleteRoute,
  routeId,
  refetchRoutes,
}: RoutePopUpProps) {
  const dispatch = useAppDispatch();
  const [likeRoute, { isLoading: likeLoading }] = useLikeRouteMutation();
  const [dislikeRoute, { isLoading: dislikeLoading }] =
    useDislikeRouteMutation();
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const { data, refetch, isLoading } = useGetRouteByIdQuery(routeId, {
    skip: routeId ? false : true,
  });

  const likes = useAppSelector(state => state.userReducer.user?.likes);
  const dislikes = useAppSelector(state => state.userReducer.user?.dislikes);

  const [mark, setMark] = useState(Marks.NO_MARK);

  useEffect(() => {
    const liked = likes?.some(item => item.id === routeId);
    const disliked = dislikes?.some(item => item.id === routeId);
    setMark(liked ? Marks.LIKE : disliked ? Marks.DISLIKE : Marks.NO_MARK);
  }, [dislikes, likes, routeId]);

  async function handleLike() {
    dispatch(setLike({ id: routeId }));
    try {
      const res = await likeRoute({ userId: userId, routeId: routeId });
    } catch (error) {
      console.log('Error while like route');
    }
  }

  async function handleDislike() {
    dispatch(setDislike({ id: routeId }));
    try {
      const res = await dislikeRoute({ userId: userId, routeId: routeId });
    } catch (error) {
      console.log('Error while like route');
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        hideModal();
      }}>
      <TouchableOpacity
        onPress={hideModal}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
        activeOpacity={1}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.modalText}>ROUTE {routeId} INFO</Text>
              </View>
              <Text style={styles.modalText}>
                Created by: {data?.author.email}
              </Text>
              <Text style={styles.modalText}>
                Status: {data?.isApproved ? 'Approved' : 'Not approved'}
              </Text>
              <View style={styles.markButtonsContainer}>
                <Pressable
                  style={[styles.likeButton]}
                  onPress={handleLike}
                  disabled={false}>
                  <Icon
                    name={mark === Marks.LIKE ? 'thumb-up' : 'thumb-up-off-alt'}
                    size={24}
                    color="#ffffff"
                  />
                </Pressable>
                <Pressable
                  style={[styles.likeButton]}
                  onPress={handleDislike}
                  disabled={false}>
                  <Icon
                    name={
                      mark === Marks.DISLIKE
                        ? 'thumb-down'
                        : 'thumb-down-off-alt'
                    }
                    size={24}
                    color="#ffffff"
                  />
                </Pressable>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => editRoute(routeId)}>
                <Text style={styles.textStyle}>EDIT ROUTE</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => deleteRoute(routeId)}>
                <Text style={styles.textStyle}>DELETE ROUTE</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={hideModal}>
                <Text style={styles.textStyle}>HIDE MODAL</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default memo(RoutePopUp);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    rowGap: 6,
  },
  markButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 150,
  },
  likeButton: {
    borderRadius: 24,
    padding: 10,
    backgroundColor: '#2196F3',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000000',
  },
});
