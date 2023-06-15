import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Theme } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import {Other} from '../../pages/save-edit-route/assets'

type ObstacleTypeProps = {
  theme: Theme;
};

export default function ObstacleType({ theme }: ObstacleTypeProps) {
  return (
    <View style={styles.section}>
      <View style={styles.obstacleType}>
        <Text style={[styles.text, { color: theme.colors.text }]}>Type:</Text>
        <View
          style={{
            height: 50,
            width: 50,
            backgroundColor: colors.darkRed,
            borderRadius: 10,
          }}></View>
          <Other width={50} height={50} />
      </View>
    </View>
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
