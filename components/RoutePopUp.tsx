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
import React, { memo } from 'react';
import { useLikeRouteMutation, useDislikeRouteMutation } from '../store/api/routes.api';

type RoutePopUpProps = {
  modalVisible: boolean;
  hideModal: () => void;
  deleteRoute: (id: number) => void;
  editRoute: (id: number) => void;
  routeId: number;
};

function RoutePopUp({
  modalVisible,
  hideModal,
  editRoute,
  deleteRoute,
  routeId,
}: RoutePopUpProps) {

  const [likeRoute, { isLoading: likeLoading }] = useLikeRouteMutation();
  const [dislikeRoute, { isLoading: dislikeLoading }] = useDislikeRouteMutation();
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
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
                <Text style={styles.modalText}>{routeId}</Text>
              </View>
              <Text style={styles.modalText}>Hello World!</Text>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 150,
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
