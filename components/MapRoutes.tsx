import React from 'react';
import { Polyline } from 'react-native-yamap';
import { MapCurrentRoute, Route } from '../types/Route';
import { Point } from '../types/Point';
import { useAppSelector } from '../hooks/redux-hooks';
import { colors } from '../utils/colors';

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
  setCurrentRoute: React.Dispatch<React.SetStateAction<MapCurrentRoute>>;
  openSheet: () => void;
  points: Point[];
  mode: number;
};

export default function MapRoutes({
  routes,
  setCurrentRoute,
  points,
  mode,
  openSheet
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
      return colors.notApproved;
    }

    if (route.likedUsers.length / route.dislikedUsers.length > 1) {
      return colors.verified;
    }

    if (route.likedUsers.length / route.dislikedUsers.length < 0.5) {
      return colors.badRoute;
    }

    return colors.midRoute;
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
                openSheet();
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
          strokeColor={colors.badRoute}
          strokeWidth={4}
          zIndex={4}
        />
      ) : null}
    </>
  );
}
