import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useRef, useMemo, useState } from 'react';
import YaMap from 'react-native-yamap';
import {
  useDeleteRouteMutation,
  useGetAllRoutesQuery,
  useSaveRouteMutation,
  useUpdateRouteMutation,
} from '../store/api/routes.api';
import RoutePopUp from '../components/BottomSheetContent';
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
import { TabNavParamList } from '../pages/Home';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks/redux-hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetRefProps } from '../components/BottomSheet';
import BottomSheetContent from '../components/BottomSheetContent';

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
type Props = NativeStackScreenProps<TabNavParamList, 'Map'>;

export default function Map({ route }: Props) {
  const initialParams = route.params;
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
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
  const [delRoute, { isLoading: deleteLoading }] = useDeleteRouteMutation();
  const [updateRoute, { isLoading: updateLoading }] = useUpdateRouteMutation();
  const userId = useAppSelector(state => state.userReducer.user?.id);

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

  const openSheet: () => void = useCallback(() => {
    bottomSheetRef.current?.scrollTo(-350);
  }, []);

  const sheetPressEdit: () => void = useCallback(() => {
    bottomSheetRef.current?.scrollTo(0);
    setMode(modes.EDIT);
    setMarkersVisible({ start: true, end: true });
  }, []);

  const hideSheet: () => void = useCallback(() => {
    setCurrentRoute({
      start: null,
      end: null,
      id: 0,
    });
    refetch();
  }, [refetch]);

  const deleteRoute: (routeId: number) => Promise<void> = useCallback(
    async (routeId: number) => {
      const response = await delRoute({ routeId });
      await refetch();
      closeRouteWork();
    },
    [delRoute, refetch],
  );

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
    if (!userId) return;

    if (currentRoute.id) {
      const response = await updateRoute({
        points,
        id: currentRoute.id,
      });
      console.log(response);
    } else {
      console.log(points);

      const response = await saveRoute({
        route: points,
        userId: userId,
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
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <YaMap
          showUserPosition={false}
          onMapPress={handleMapPress}
          style={{ flex: 1 }}
          nightMode={true}
          mapType={'vector'}
          ref={map}
          initialRegion={{
            lat: initialParams.lat,
            lon: initialParams.lon,
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
            openSheet={openSheet}
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
        <BottomSheet hideSheet={hideSheet} ref={bottomSheetRef}>
          <BottomSheetContent
            deleteRoute={deleteRoute}
            editRoute={sheetPressEdit}
            routeId={currentRoute.id}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
