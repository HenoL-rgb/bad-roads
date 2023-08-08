import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { User } from '../../../store/slices/user.slice';
import { GetRouteByIdResponse } from '../../../types/GetAllRoutesQuery';
import { colors } from '../../../utils/colors';

type ControlsType = {
  data: GetRouteByIdResponse;
  editRoute: () => void;
  deleteRoute: () => void;
  handleApprove: () => void;
  routeId: number;
  user: User | null;
  approveLoading: boolean;
};
export default function Controls({
  data,
  editRoute,
  deleteRoute,
  handleApprove,
  user,
  approveLoading,
}: ControlsType) {
  const isAdmin = user
    ? user.roles.some(
        (role: { value: string; description: string }) =>
          role.value === 'ADMIN',
      )
    : false;

  return (
    <View style={styles.routeControls}>
      {(isAdmin || (data.author.email === user?.email && !data.isApproved)) && (
        <>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={editRoute}>
            <Icon name="edit" size={24} color={colors.gray} />
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={deleteRoute}>
            <Icon name="delete" size={24} color={colors.gray} />
          </Pressable>
        </>
      )}
      {isAdmin && (
        <Pressable
          style={[
            styles.button,
            styles.buttonClose,
            { opacity: data.isApproved ? 0.4 : 1 },
          ]}
          disabled={data.isApproved}
          onPress={handleApprove}>
          {approveLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon name="done" size={24} color={colors.gray} />
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
    borderWidth: 1,
  },

  buttonClose: {},
  routeControls: {
    flexDirection: 'row',
    columnGap: 10,
  },
});
