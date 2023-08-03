import { StyleSheet } from 'react-native';
import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  FadeInRight,
  FadeOutRight,
  ZoomIn,
  ZoomOut,

} from 'react-native-reanimated';
import { colors } from '../utils/colors';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setInitialState, setMode, setPoints } from '../store/slices/routes.slice';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

type MapButtonsProps = {
  handleSaveRoute: () => void;
  findRoute: () => void;
  
};

export default function MapButtons({
  handleSaveRoute,
  findRoute,
}: MapButtonsProps) {
  const dispatch = useAppDispatch();
  const { mode, markersVisible } = useAppSelector(state => state.routesReducer);
  
 
  return (
    <>
      {mode === modes.IDLE && (
        <Animated.View
          style={styles.addButton}
          entering={FadeInRight.duration(150)}
          exiting={FadeOutRight.duration(120)}>
          <Pressable
            style={styles.pressable}
            onPress={() => {
              dispatch(setMode(modes.CREATE));
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
          entering={ZoomIn.duration(150)}
          exiting={ZoomOut.duration(150)}>
          <Pressable onPress={() => dispatch(setInitialState())} style={styles.pressable}>
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
              dispatch(setPoints([]));
              dispatch(setMode(modes.CREATE));
            }}>
            <Icon name="undo" size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      )}

      {(mode === modes.CREATE || mode === modes.EDIT) && (
        <Animated.View
          style={[styles.addButton, {opacity: markersVisible.end ? 1 : 0.5}]}
          entering={ZoomIn.duration(150)}
          exiting={ZoomOut.duration(150)}>
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
