import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Theme } from '@react-navigation/native';
import { colors } from '../../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SvgProps } from 'react-native-svg';
import * as assets from '../../../pages/save-edit-route/assets';

type Key = keyof typeof assets;

type ObstacleTypeProps = {
  theme: Theme;
  setModalActive: () => void;
  Obstacle: Key | null;
};

export default function ObstacleType({
  theme,
  setModalActive,
  Obstacle,
}: ObstacleTypeProps) {
  const ObstacleIcon = assets[Obstacle ?? 'Other'] as React.FC<SvgProps>;
  return (
    <>
      <View style={styles.section}>
        <View style={styles.obstacleType}>
          <Text style={[styles.text, { color: theme.colors.text }]}>Type:</Text>
          <View
            onTouchEnd={setModalActive}
            style={{
              height: 60,
              width: 60,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {Obstacle ? (
              <ObstacleIcon />
            ) : (
              <Icon name="add" size={25} color={colors.gray} style={{right: 15, top: 2}} />
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  obstacleType: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  text: {
    color: colors.black,
    fontSize: 18,
    paddingLeft: 3,
  },
  section: {
    borderRadius: 5,
  },
  cancelBtn: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtn: {
    marginTop: 3,
    width: 100,
  },
});
