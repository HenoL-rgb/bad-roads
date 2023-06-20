import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';
import { GetRouteByIdResponse } from '../../types/GetAllRoutesQuery';

enum Marks {
  LIKE,
  DISLIKE,
  NO_MARK,
}

type MarkButtonsProps = {
  handleLike: () => void;
  handleDislike: () => void;
  data: GetRouteByIdResponse;
  mark: Marks;
};

export default function MarkButtons({
  handleDislike,
  handleLike,
  data,
  mark,
}: MarkButtonsProps) {
  return (
    <View style={styles.markButtonsContainer}>
      <Pressable
        style={[styles.likeButton, { opacity: data.isApproved ? 1 : 0.5 }]}
        onPress={handleLike}
        disabled={!data.isApproved}>
        <Icon
          name={mark === Marks.LIKE ? 'thumb-up' : 'thumb-up-off-alt'}
          size={24}
          color={colors.white}
        />
      </Pressable>
      <Pressable
        style={[styles.dislikeButton, { opacity: data.isApproved ? 1 : 0.5 }]}
        onPress={handleDislike}
        disabled={!data.isApproved}>
        <Icon
          name={mark === Marks.DISLIKE ? 'thumb-down' : 'thumb-down-off-alt'}
          size={24}
          color={colors.white}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  likeButton: {
    borderRadius: 24,
    padding: 10,
    backgroundColor: colors.lime,
  },
  dislikeButton: {
    borderRadius: 24,
    padding: 10,
    backgroundColor: colors.red,
  },

  markButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 15,
    paddingRight: 10,
    paddingBottom: 10,
  },
});
