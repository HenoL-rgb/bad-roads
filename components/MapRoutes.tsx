import { View, Text } from 'react-native'
import React from 'react'
import { Polyline } from 'react-native-yamap';
import { MapCurrentRoute, Route } from '../types/Route';
import { Point } from '../types/Point';
import { getCurrentScope } from 'immer/dist/internal';


enum modes {
    IDLE,
    ADD,
    EDIT,
    CREATE,
    ROUTE_ADDED,
    ROUTE_APPROVED,
  }

type MapRoutesProps = {
    routes: Route[],
    currentRoute: MapCurrentRoute,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentRoute: React.Dispatch<React.SetStateAction<MapCurrentRoute>>,
    points: Point[],
    mode: number
}
  
export default function MapRoutes({routes, currentRoute, setModalVisible, setCurrentRoute, points, mode}: MapRoutesProps) {
  function getRouteColor(route: Route): string {
    if(route.likedUsers.length / route.dislikedUsers.length > 0.8) {
      return '#1bfa07'
    }

    if(route.likedUsers.length / route.dislikedUsers.length > 0.6) {
      return '#fad507'
    }   

    return '#e71313'

  }  
  return (
    <>
    {routes &&
    //.filter((route: Route) => route.isApproved)
          routes.map((route: Route) => (
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
  )
}