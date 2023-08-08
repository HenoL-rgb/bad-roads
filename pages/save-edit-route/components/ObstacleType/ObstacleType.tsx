import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ThemesType } from '../../../../types/Themes';
import { colors } from '../../../../utils/colors';
import * as assets from '../../assets';

type Key = keyof typeof assets;

type ObstacleTypeProps = {
  theme: ThemesType;
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
          <View onTouchEnd={setModalActive} style={styles.iconWrapper}>
            {Obstacle ? (
              <ObstacleIcon />
            ) : (
              <Icon
                name="add"
                size={25}
                color={colors.gray}
                style={styles.icon}
              />
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
  iconWrapper: {
    height: 60,
    width: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { right: 15, top: 2 },
});
