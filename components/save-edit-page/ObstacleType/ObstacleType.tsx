import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Theme } from '@react-navigation/native';
import { colors } from '../../../utils/colors';

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
  const Icon = assets[Obstacle ? Obstacle : 'Other'] as React.FC<SvgProps>;
  return (
    <>
      <View style={styles.section}>
        <View style={styles.obstacleType}>
          <Text style={[styles.text, { color: theme.colors.text }]}>Type:</Text>
            <View
              onTouchEnd={setModalActive}
              style={{
                height: 50,
                width: 50,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon />
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
