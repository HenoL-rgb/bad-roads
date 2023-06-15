import { View, Text, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import { Theme } from '@react-navigation/native';
import { colors } from '../../../utils/colors';
import {Other} from '../../../pages/save-edit-route/assets'
import ObstaclesDropDown from './ObstaclesDropDown';
import { ModalRefProps } from '../../modals/Modal';
import { SvgProps } from 'react-native-svg';

type ObstacleTypeProps = {
  theme: Theme;
  setModalActive: () => void;
  Obstacle: React.FC<SvgProps> | null;
};

export default function ObstacleType({ theme, setModalActive, Obstacle }: ObstacleTypeProps) {
  return (
    <>
    <View style={styles.section}>
      <View style={styles.obstacleType}>
        <Text style={[styles.text, { color: theme.colors.text }]}>Type:</Text>
        <View onTouchEnd={setModalActive}
          style={{
            height: 50,
            width: 50,
            backgroundColor: Obstacle ? colors.eyePress : colors.darkRed,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {Obstacle && <Obstacle />}
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
});