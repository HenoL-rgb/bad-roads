import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import { useAppSelector } from '../../../hooks/redux-hooks';
import { GetRoutesResponse } from '../../../types/GetAllRoutesQuery';
import { Route } from '../../../types/Route';

import RouteListItem from './RouteListItem';

type RefetchType = () => QueryActionCreatorResult<
  QueryDefinition<
    number,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    never,
    GetRoutesResponse[],
    'routesApi'
  >
>;
export type RefetchMutationType = MutationTrigger<
  MutationDefinition<
    object,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    never,
    GetRoutesResponse[],
    'routesApi'
  >
>;

type RouteListProps = {
  routes: Route[];
  navigate: (lat: number, lon: number) => void;
  refetch?: RefetchType;
  refetchMut?: RefetchMutationType;
  loading: boolean;
};

export default function RouteList({
  routes,
  navigate,
  loading,
  refetch,
  refetchMut,
}: RouteListProps) {
  const { colors: theme } = useAppSelector(state => state.themeReducer);

  const renderItem = useCallback(
    ({ item }: { item: Route }) => (
      <RouteListItem route={item} navigate={navigate} />
    ),
    [navigate],
  );

  function refetchOnType() {
    if (refetch) {
      return refetch;
    } else if (refetchMut) {
      return () => refetchMut({});
    }
  }
  const keyExtractor = useCallback((item: Route) => `${item.id}`, []);

  return (
    <View style={styles.wrapper}>
      {routes.length > 0 ? (
        <FlashList
          data={routes}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetchOnType} />
          }
          renderItem={renderItem}
          estimatedItemSize={80}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <ActivityIndicator size={'small'} color={theme.activity} />
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  separator: {
    height: 5,
  },
});
