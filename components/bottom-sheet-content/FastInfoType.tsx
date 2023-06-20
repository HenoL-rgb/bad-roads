import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';
import { GetRouteByIdResponse } from '../../types/GetAllRoutesQuery';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as assets from '../../pages/save-edit-route/assets'
import { SvgProps } from 'react-native-svg';
import { useAppSelector } from '../../hooks/redux-hooks';

type FastInfoType = {
  data: GetRouteByIdResponse;
};
export default function FastInfo({ data }: FastInfoType) {
  const theme = useAppSelector(state => state.themeReducer);
  const Obstacle = assets[data.obstacle.icon] as React.FC<SvgProps>;

  const textStyle = {...styles.modalText, color: theme.colors.text}

  return (
    <View style={styles.header}>
      <View style={styles.sign}>
      <Obstacle />
        {data.isApproved ? (
          <>
            <View style={styles.fillBg}></View>
            <Icon
              name="verified"
              size={24}
              color={colors.verified}
              style={styles.approved}
            />
          </>
        ) : (
          <View style={styles.notApproved}></View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={textStyle}>Added by: {data.author.email}</Text>
        <Text style={textStyle}>Date: {data.createdAt.split('T')[0]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    columnGap: 20,
    marginBottom: 20,
  },
  approved: {
    position: 'absolute',
    right: -10,
    bottom: -8,
  },
  notApproved: {
    height: 15,
    width: 15,
    backgroundColor: colors.gray,
    borderRadius: 10,
    position: 'absolute',
    right: -4,
    bottom: -4,
  },
  info: {
    rowGap: 5,
  },
  modalText: {
    color: colors.black,
    fontSize: 17,
  },
  sign: {
    width: 60,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  fillBg: {
    height: 10,
    width: 12,
    backgroundColor: 'white',
    position: 'absolute',
    right: -4,
    bottom: -2,
  },
});
