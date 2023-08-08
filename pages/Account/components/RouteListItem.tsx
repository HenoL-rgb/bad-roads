import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppSelector } from '../../../hooks/redux-hooks';
import { Route } from '../../../types/Route';
import { colors } from '../../../utils/colors';

type RouteListItemProps = {
  route: Route;
  navigate: (lat: number, lon: number) => void;
};

function RouteListItem({ route, navigate }: RouteListItemProps) {
  const theme = useAppSelector(state => state.themeReducer);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={{
            uri: route.icon,
          }}
        />
      </View>

      <View
        style={[styles.infoWrapper, { backgroundColor: theme.colors.card }]}>
        <View style={styles.geoInfo}>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {t('lat')}: {route.route[0].lat.toFixed(5)}
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {t('lon')}: {route.route[0].lon.toFixed(5)}
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {t('status')}: {route.isApproved ? t('approved') : t('notApproved')}
          </Text>
        </View>
        <Pressable
          onPress={() => navigate(route.route[0].lat, route.route[0].lon)}>
          <Icon name="room" size={30} color={colors.gray} />
        </Pressable>
      </View>
    </View>
  );
}

export default RouteListItem;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 1,
  },
  infoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 5,
  },

  geoInfo: {
    rowGap: 5,
  },

  infoText: {
    color: colors.black,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    backgroundColor: '#132331',
  },
  image: {
    width: 80,
    height: 80,
  },
});
