import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';
import { GetRouteByIdResponse } from '../../types/GetAllRoutesQuery';
import Icon from 'react-native-vector-icons/MaterialIcons';

type UserType = {
  data: GetRouteByIdResponse;
};
export default function User({ data }: UserType) {
  return (
    <View style={styles.header}>
      <View style={styles.sign}>
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
        <Text style={styles.modalText}>{data.author.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    columnGap: 10,
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
  info: {},
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: colors.black,
  },
  sign: {
    width: 60,
    height: 60,
    backgroundColor: 'pink',
    position: 'relative',
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
