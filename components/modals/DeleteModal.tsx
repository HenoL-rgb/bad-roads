import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppSelector } from '../../hooks/redux-hooks';
import { colors } from '../../utils/colors';

import Modal, { ModalRefProps } from './Modal';

type Props = {
  deleteRoute: () => void;
  modalRef: React.RefObject<ModalRefProps>;
  deleteLoading: boolean;
};

const DeleteModal = (props: Props) => {
  const theme = useAppSelector(state => state.themeReducer);

  const progress = useSharedValue(1.15);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: progress.value }],
    };
  });

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [progress]);
  return (
    <>
      <Modal ref={props.modalRef}>
        <View style={styles.wrapper}>
          <View style={[styles.deleteIconWrapper]}>
            <Animated.View style={[styles.deleteIcon, reanimatedStyle]}>
              <Icon name="delete" size={50} color={colors.darkRed} />
            </Animated.View>
          </View>
          <View style={styles.textWrapper}>
            <Text
              style={[
                styles.text,
                {
                  color: theme.colors.text,
                },
              ]}>
              Are you sure you want do delete this route?
            </Text>
          </View>
          <View style={styles.buttons}>
            <Pressable
              onPress={() => props.modalRef.current?.setActive(false)}
              style={styles.cancelBtn}>
              <Text style={{ color: theme.colors.text }}>CANCEL</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={props.deleteRoute}>
              {props.deleteLoading ? (
                <ActivityIndicator size={'small'} color={colors.white} />
              ) : (
                <Text style={{ color: colors.white }}>DELETE</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
  },
  deleteIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    padding: 20,
    borderColor: colors.darkRed,
    borderWidth: 1,
    borderRadius: 50,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
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
  },
  deleteBtn: {
    backgroundColor: colors.darkRed,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    width: 90,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
