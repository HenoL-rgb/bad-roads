import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import Modal, { ModalRefProps } from './Modal';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  modalRef: React.RefObject<ModalRefProps>;
  error: string;
};

export default function ErrorModal({ modalRef, error }: Props) {
  const progress = useSharedValue(1);
  const rotation = useSharedValue(0);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: progress.value },
        { rotateZ: `${rotation.value}deg` },
      ],
    };
  });

  useEffect(() => {
    progress.value = withRepeat(withDelay(1300, withSequence(
      withTiming(1.2, { duration: 800 }),
      withDelay(250, withTiming(1, { duration: 400 })))
    ), -1, true);
    rotation.value = withRepeat(
      withDelay(
        2000,
        withSequence(
          withTiming(-20, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(20, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(-20, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(10, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(0, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
        ),
      ),
      -1,
    );
  }, [progress, rotation]);

  return (
    <Modal ref={modalRef}>
      <View style={styles.wrapper}>
        <View style={[styles.deleteIconWrapper]}>
          <Animated.View style={[styles.deleteIcon, reanimatedStyle]}>
            <Icon name="error-outline" size={80} color={colors.red} />
          </Animated.View>
        </View>
        <View style={styles.text}>
          <Text
            style={{ color: colors.black, fontSize: 18, textAlign: 'center' }}>
            Error: {error}
          </Text>
        </View>
        <Pressable
          onPress={() => modalRef.current?.setActive(false)}
          style={({pressed}) => [
            {
              ...styles.cancelBtn,
              backgroundColor: pressed ? colors.eyePress : 'transparent'

            }
          ]}>
          <Text style={{ color: colors.black }}>DISMISS</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 0,
  },
  deleteIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    padding: 20,
    
  },
  text: {
    padding: 20,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cancelBtn: {
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 20,
    paddingBottom: 20,
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
