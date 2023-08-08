import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import { useAppSelector } from '../../hooks/redux-hooks';
import AccountRoutesList from '../../navigation/AccountRoutesList';
import { useGetRoutesByUserIdQuery } from '../../store/api/routes.api';
import { UserData } from '../../store/slices/user.slice';

export default function Account() {
  const userData: UserData = useAppSelector(state => state.userReducer);
  const theme = useAppSelector(state => state.themeReducer);
  const { t } = useTranslation();

  const { data: routesData, refetch } = useGetRoutesByUserIdQuery(
    userData.user?.id ?? 0,
    {
      skip: userData.user ? false : true,
    },
  );

  const date = userData.user?.createdAt
    ? userData.user.createdAt.toString().split('T')[0]
    : 'no data';

  useFocusEffect(
    useCallback(() => {
      if (routesData) {
        refetch();
      }
    }, [routesData, refetch]),
  );

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <View style={styles.headerEmail}>
          <Text
            style={[
              { ...styles.headerText, fontSize: 20 },
              { color: theme.colors.text },
            ]}>
            {userData.user?.email}
          </Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.info}>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>
            Id: {userData.user?.id}
          </Text>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>
            {t('memberSince')}: {date}
          </Text>
        </View>
      </View>
      <AccountRoutesList theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    rowGap: 20,
  },

  header: {},

  info: {
    paddingTop: 10,
    rowGap: 5,
  },

  divider: {
    height: 1,
    backgroundColor: '#c2c2c29b',
  },

  headerEmail: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    color: '#000000',
  },

  routesList: {
    rowGap: 15,
  },

  logoutBtn: {},
});
