import { View, Text, ScrollView } from 'react-native';
import React, { useCallback } from 'react';
import { Button } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setAuth, UserData } from '../store/slices/user.slice';
import {
  routesApi,
  useGetLikedByUserIdQuery,
  useGetRoutesByUserIdQuery,
} from '../store/api/routes.api';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import RouteListItem from '../components/RouteListItem';
import { TabNavParamList } from '../components/AppWrapper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RouteList from '../components/RouteList';
import { useFocusEffect } from '@react-navigation/native';
import AccountRoutesList from '../navigation/AccountRoutesList';

type Props = NativeStackScreenProps<TabNavParamList, 'Account'>;

export default function Account({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const userData: UserData = useAppSelector(state => state.userReducer);
  const {
    data: routesData,
    refetch,
    isLoading,
  } = useGetRoutesByUserIdQuery(userData.user?.id ?? 0, {
    skip: userData.user ? false : true,
  });

  const {
    data: likesData,
    refetch: refetchLikes,
    isLoading: isLikesLoading,
  } = useGetLikedByUserIdQuery(userData.user?.id ?? 0, {
    skip: userData.user ? false : true,
  });

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

  const routes = routesData?.map(
    (routeData: {
      id: number;
      createdAt: Date;
      isApproved: boolean;
      route: string;
    }) => ({ ...routeData, route: JSON.parse(routeData.route) }),
  );

  function routeNavigate(lat: number, lon: number) {
    navigation.navigate('Map', {
      lat: lat,
      lon: lon,
    });
  }  

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerEmail}>
          <Text style={{ ...styles.headerText, fontSize: 20 }}>
            {userData.user?.email}
          </Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.info}>
          <Text style={styles.headerText}>Id: {userData.user?.id}</Text>
          <Text style={styles.headerText}>Member since: {date}</Text>
        </View>
      </View>
      <AccountRoutesList />
      {/* {routes && (
        <RouteList
          routes={routes}
          navigate={routeNavigate}
          refetch={refetch}
          loading={isLoading}
        />
      )}

      {likesData?.map((like: any) => (
        <Text key={like.routeId}>{like.routeId}</Text>
      ))} */}
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
