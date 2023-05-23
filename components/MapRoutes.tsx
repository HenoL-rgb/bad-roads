import { View, Text } from 'react-native';
import React from 'react';
import { Polyline } from 'react-native-yamap';
import { MapCurrentRoute, Route } from '../types/Route';
import { Point } from '../types/Point';
import { getCurrentScope } from 'immer/dist/internal';
import { useAppSelector } from '../hooks/redux-hooks';
import useGetUserRoutes from '../hooks/useGetUserRoutes';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

type MapRoutesProps = {
  routes: Route[];
  currentRoute: MapCurrentRoute;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentRoute: React.Dispatch<React.SetStateAction<MapCurrentRoute>>;
  points: Point[];
  mode: number;
};

export default function MapRoutes({
  routes,
  currentRoute,
  setModalVisible,
  setCurrentRoute,
  points,
  mode,
}: MapRoutesProps) {
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const roles = useAppSelector(state => state.userReducer.user?.roles);
  const isAdmin = roles
    ? roles.some(
        (role: { value: string; description: string }) =>
          role.value === 'ADMIN',
      )
    : false;

  function getRouteColor(route: Route): string {
    if (!route.isApproved) {
      return '#868686';
    }

    if (route.likedUsers.length / route.dislikedUsers.length > 1) {
      return '#1bfa07';
    }

    if (route.likedUsers.length / route.dislikedUsers.length < 0.5) {
      return '#e71313';
    }

    return '#fad507';
  }

  return (
    <>
      {routes &&
        //
        routes
          .filter(
            (route: Route) =>
              isAdmin || route.isApproved || route.userId === userId,
          )
          .map((route: Route) => (
            <Polyline
              key={route.id}
              points={route.route}
              strokeColor={getRouteColor(route)}
              strokeWidth={4}
              zIndex={4}
              onPress={() => {
                if (mode !== modes.IDLE) return;

                setModalVisible(true);
                setCurrentRoute({
                  start: route.route[0],
                  end: route.route[route.route.length - 1],
                  id: route.id,
                });
              }}
            />
          ))}
      {points.length ? (
        <Polyline
          points={points}
          strokeColor="#f11515"
          strokeWidth={4}
          zIndex={4}
        />
      ) : null}
    </>
  );
}
