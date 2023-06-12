import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Point } from '../types/Point';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { colors } from '../utils/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../pages/AppWrapper';
import { useNavigation } from '@react-navigation/native';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

type MapButtonsProps = {
  mode: number;
  setMode: React.Dispatch<React.SetStateAction<number>>;
  handleSaveRoute: () => void;
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  findRoute: () => void;
  markersVisible: {
    start: boolean;
    end: boolean;
  };
  closeRouteWork: () => void;
};

export default function MapButtons({
  mode,
  setMode,
  handleSaveRoute,
  setPoints,
  findRoute,
  markersVisible,
  closeRouteWork,
}: MapButtonsProps) {


  return (
    <>
      {mode === modes.IDLE && (
        <Animated.View
          style={styles.addButton}
          entering={FadeInRight.duration(120)}
          exiting={FadeOutRight.duration(120)}>
          <Pressable
            style={styles.pressable}
            onPress={() => {
              setMode(modes.CREATE);
            }}>
            <Icon name="add" size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      )}

      {(mode === modes.CREATE ||
        mode === modes.ROUTE_ADDED ||
        mode === modes.EDIT) && (
        <Animated.View
          style={{
            ...styles.addButton,
            bottom: 80,
            backgroundColor: colors.darkRed,
          }}
          entering={ZoomIn.duration(120)}
          exiting={ZoomOut.duration(120)}>
          <Pressable onPress={closeRouteWork} style={styles.pressable}>
            <Icon name="close" size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      )}

      {mode === modes.ROUTE_ADDED && (
        <Animated.View
          style={{ ...styles.addButton, backgroundColor: colors.green }}
          entering={FadeInRight.duration(120)}
          exiting={FadeOutRight.duration(120)}>
          <Pressable style={styles.pressable} onPress={handleSaveRoute}>
            <Icon name="done" size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      )}

      {mode === modes.ROUTE_ADDED && (
        <Animated.View
          style={{
            ...styles.addButton,
            backgroundColor: colors.undo,
            bottom: 200,
          }}
          entering={ZoomIn.duration(120)}
          exiting={ZoomOut.duration(120)}>
          <Pressable
            style={styles.pressable}
            onPress={() => {
              setPoints([]);
              setMode(modes.CREATE);
            }}>
            <Icon name="undo" size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      )}

      {(mode === modes.CREATE || mode === modes.EDIT) && (
        <Animated.View
          style={{
            ...styles.addButton,
            opacity: !(markersVisible.start && markersVisible.end) ? 0.5 : 1,
          }}
          entering={FadeInLeft.duration(120)}
          exiting={FadeOutLeft.duration(120)}>
          <Pressable
            onPress={findRoute}
            style={styles.pressable}
            disabled={!(markersVisible.start && markersVisible.end)}>
            <Icon name="done" size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.blue,
    position: 'absolute',
    right: 20,
    bottom: 140,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
});
