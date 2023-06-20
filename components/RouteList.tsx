import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback } from 'react';
import { Route } from '../types/Route';
import RouteListItem from './account-page/RouteListItem';
import { FlashList } from '@shopify/flash-list';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { colors } from 'react-native-elements';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { GetRoutesResponse } from '../types/GetAllRoutesQuery';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';

type RefetchType = () => QueryActionCreatorResult<QueryDefinition<number, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, never, GetRoutesResponse[], "routesApi">>;
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
  refetchMut
}: RouteListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Route }) => (
      <RouteListItem route={item} navigate={navigate} />
    ),
    [navigate],
  );

  function refetchOnType() {
    if(refetch) {
      return refetch;
    } else if(refetchMut) {
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
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          ListEmptyComponent={
            <ActivityIndicator size={'small'} color={colors.black} />
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
});
