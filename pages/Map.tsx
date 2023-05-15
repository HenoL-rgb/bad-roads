import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Button,
  NativeSyntheticEvent,
} from 'react-native';
import React, { useCallback, useRef, useMemo, useState } from 'react';
import YaMap, { Marker, Polyline } from 'react-native-yamap';
import {
  useDeleteRouteMutation,
  useGetAllRoutesQuery,
  useSaveRouteMutation,
  useUpdateRouteMutation,
} from '../store/api/routes.api';
import RoutePopUp from '../components/RoutePopUp';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Point } from '../types/Point';
import {
  DataRoute,
  MapCurrentRoute,
  Route,
  RouteSection,
} from '../types/Route';
import { YANDEX_API_KEY } from '@env';
import MapButtons from '../components/MapButtons';
import MapMarkers from '../components/MapMarkers';
import MapRoutes from '../components/MapRoutes';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

enum currentMarker {
  START,
  END,
}

export default function Map() {
  YaMap.init(YANDEX_API_KEY);
  const [modalVisible, setModalVisible] = useState(false);
  const [markersVisible, setMarkersVisible] = useState({
    start: false,
    end: false,
  });
  const [currentRoute, setCurrentRoute] = useState<MapCurrentRoute>({
    start: null,
    end: null,
    id: 0,
  });

  const [points, setPoints] = useState<Point[]>([]);
  const [current, setCurrent] = useState<number>(currentMarker.START);
  const [mode, setMode] = useState<number>(modes.IDLE);
  const { data, isLoading, refetch } = useGetAllRoutesQuery({});
  const map = useRef<YaMap>(null);
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
  const [delRoute, { isLoading: deleteLoading }] = useDeleteRouteMutation();
  const [updateRoute, { isLoading: updateLoading }] = useUpdateRouteMutation();

  const routes: Route[] = useMemo(
    () =>
      data
        ? data.map((item: DataRoute) => ({
            ...item,
            route: JSON.parse(item.route),
          }))
        : [],
    [data],
  );

  const hideModal: (mode?: number) => void = useCallback((mode?: number) => {
    if (mode && mode !== modes.EDIT) {
      setCurrentRoute({
        start: null,
        end: null,
        id: 0,
      });
    }
    setModalVisible(false);
  }, []);

  const deleteRoute: (routeId: number) => Promise<void> = useCallback(
    async (routeId: number) => {
      const response = await delRoute({ routeId });
      await refetch();
      closeRouteWork();
      hideModal();
    },
    [delRoute, hideModal, refetch],
  );

  const editRoute: () => void = useCallback(() => {
    setMode(modes.EDIT);
    setMarkersVisible({ start: true, end: true });
    hideModal(modes.EDIT);
  }, [hideModal]);

  function closeRouteWork(): void {
    setMode(modes.IDLE);
    setMarkersVisible({ start: false, end: false });
    setCurrent(currentMarker.START);
    setCurrentRoute({
      start: null,
      end: null,
      id: 0,
    });
    setPoints([]);
  }

  async function handleSaveRoute(): Promise<void> {
    if (currentRoute.id) {
      const response = await updateRoute({
        points,
        id: currentRoute.id,
      });
      console.log(response);
      
    } else {
      const response = await saveRoute({
        route: points,
        userId: 4
      });
      console.log(response);
      
    }
    await refetch();
    closeRouteWork();
  }

  function findRoute(): void {
    if (!currentRoute.start || !currentRoute.end) return;

    setMode(modes.ROUTE_ADDED);
    map.current?.findDrivingRoutes(
      [currentRoute.start, currentRoute.end],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (e: RouteEvent) => {
        const points = e.routes[0].sections.reduce(
          (acc: Point[], item: RouteSection) => [...acc, ...item.points],
          [],
        );

        setPoints(points);
      },
    );
  }

  function handleMapPress(event: NativeSyntheticEvent<Point>) {
    if (mode === modes.CREATE || mode === modes.EDIT) {
      if (current === currentMarker.START) {
        setCurrentRoute({
          ...currentRoute,
          start: {
            lat: event.nativeEvent.lat,
            lon: event.nativeEvent.lon,
          },
        });

        if (!markersVisible.start) {
          setCurrent(currentMarker.END);

          setMarkersVisible({ ...markersVisible, start: true });
        }
      } else {
        setCurrentRoute({
          ...currentRoute,
          end: {
            lat: event.nativeEvent.lat,
            lon: event.nativeEvent.lon,
          },
        });
        if (!markersVisible.end)
          setMarkersVisible({ ...markersVisible, end: true });
      }
    }
  }

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <RoutePopUp
        modalVisible={modalVisible}
        hideModal={hideModal}
        deleteRoute={deleteRoute}
        editRoute={editRoute}
        routeId={currentRoute.id}
      />
      <YaMap
        showUserPosition={false}
        onMapPress={handleMapPress}
        style={{ flex: 1 }}
        nightMode={true}
        mapType={'vector'}
        ref={map}
        initialRegion={{
          lat: 55.17,
          lon: 30.2153,
          zoom: 17,
          azimuth: 0,
        }}>
        <MapMarkers
          markersVisible={markersVisible}
          current={current}
          currentRoute={currentRoute}
          setCurrent={setCurrent}
        />

        <MapRoutes
          currentRoute={currentRoute}
          routes={routes}
          setModalVisible={setModalVisible}
          setCurrentRoute={setCurrentRoute}
          points={points}
          mode={mode}
        />
      </YaMap>

      <MapButtons
        mode={mode}
        setMode={setMode}
        handleSaveRoute={handleSaveRoute}
        setPoints={setPoints}
        findRoute={findRoute}
        markersVisible={markersVisible}
        closeRouteWork={closeRouteWork}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
