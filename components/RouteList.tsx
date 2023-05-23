import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import { Route } from '../types/Route';
import RouteListItem from './RouteListItem';
import { FlashList } from '@shopify/flash-list';
import {
  QueryDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';

type RouteListProps = {
  routes: Route[];
  navigate: (lat: number, lon: number) => void;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      number,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        object
      >,
      never,
      any,
      'routesApi'
    >
  >;
  loading: boolean;
};

export default function RouteList({
  routes,
  navigate,
  loading,
  refetch,
}: RouteListProps) {
  
  const renderItem = useCallback(
    ({ item }: { item: Route }) => (
      <RouteListItem route={item} navigate={navigate} />
    ),
    [navigate],
  );

  const keyExtractor = useCallback((item: Route) => `${item.id}`, []);

  return (
    <View style={styles.wrapper}>
      <FlashList
        data={routes}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        renderItem={renderItem}
        estimatedItemSize={80}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
