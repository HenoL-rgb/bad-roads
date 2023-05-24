import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Point } from '../types/Point';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

type MapButtonsProps = {
    mode: number,
    setMode: React.Dispatch<React.SetStateAction<number>>,
    handleSaveRoute: () => Promise<void>,
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>,
    findRoute: () => void,
    markersVisible: {
        start: boolean,
        end: boolean
    },
    closeRouteWork: () => void,
}

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
        <Pressable
          onPress={() => {
            setMode(modes.CREATE);
          }}
          style={styles.addButton}>
          <Icon name="add" size={20} color="white" />
        </Pressable>
      )}

      {(mode === modes.CREATE ||
        mode === modes.ROUTE_ADDED ||
        mode === modes.EDIT) && (
        <Pressable
          onPress={closeRouteWork}
          style={{
            ...styles.addButton,
            bottom: 80,
            backgroundColor: '#bd2727',
          }}>
          <Icon name="close" size={20} color="white" />
        </Pressable>
      )}

      {mode === modes.ROUTE_ADDED && (
        <>
          <Pressable
            onPress={handleSaveRoute}
            style={{ ...styles.addButton, backgroundColor: 'green' }}>
            <Icon name="done" size={20} color="white" />
          </Pressable>
        </>
      )}

      {mode === modes.ROUTE_ADDED && (
        <Pressable
          onPress={() => {
            setPoints([]);
            setMode(modes.CREATE);
          }}
          style={{
            ...styles.addButton,
            backgroundColor: '#6e6e6e',
            bottom: 190,
          }}>
          <Icon name="undo" size={20} color="white" />
        </Pressable>
      )}

      {(mode === modes.CREATE || mode === modes.EDIT) && (
        <Pressable
          onPress={findRoute}
          style={{
            ...styles.addButton,
            opacity: !(markersVisible.start && markersVisible.end) ? 0.5 : 1,
          }}
          disabled={!(markersVisible.start && markersVisible.end)}>
          <Icon name="done" size={20} color="white" />
        </Pressable>
      )}
    </>
  );
}


const styles = StyleSheet.create({
    addButton: {
        width: 50,
        height: 50,
        backgroundColor: '#2196F3',
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
})