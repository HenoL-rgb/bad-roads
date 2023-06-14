import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useRef, useMemo } from 'react';
import YaMap from 'react-native-yamap';
import {
  useDeleteRouteMutation,
  useGetAllRoutesQuery,
} from '../store/api/routes.api';
import { Point } from '../types/Point';
import { DataRoute, Route, RouteSection } from '../types/Route';
import MapButtons from '../components/MapButtons';
import MapMarkers from '../components/MapMarkers';
import MapRoutes from '../components/MapRoutes';
import { TabNavParamList } from '../pages/Home';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetRefProps } from '../components/BottomSheet';
import BottomSheetContent from '../components/BottomSheetContent';
import { ModalRefProps } from '../components/modals/Modal';
import DeleteModal from '../components/modals/DeleteModal';
import { colors } from '../utils/colors';
import { StackParamList } from './AppWrapper';
import { useNavigation } from '@react-navigation/native';
import {
  setMode,
  setMarkersVisible,
  setCurrentRoute,
  setInitialState,
  setCurrentMarker,
  setPoints,
} from '../store/slices/routes.slice';
import useGetAllRoutes from '../hooks/useGetAllRoutes';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

enum CurrentMarker {
  START,
  END,
}
type Props = NativeStackScreenProps<TabNavParamList, 'Map'>;
type RootNavigation = NativeStackNavigationProp<StackParamList>;

export default function Map({ route }: Props) {
  const initialParams = route.params;

  const { mode, currentMarker, currentRoute, markersVisible, points } =
    useAppSelector(state => state.routesReducer);

  const dispatch = useAppDispatch();
  const { routes, isLoading, refetch } = useGetAllRoutes();
  const map = useRef<YaMap>(null);
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const modalRef = useRef<ModalRefProps>(null);
  const saveModalRef = useRef<ModalRefProps>(null);
  const [delRoute, { isLoading: deleteLoading }] = useDeleteRouteMutation();
  const navigation = useNavigation<RootNavigation>();

  const openSheet: () => void = useCallback(() => {
    bottomSheetRef.current?.scrollTo(-350);
  }, []);

  const sheetPressEdit: () => void = useCallback(() => {
    bottomSheetRef.current?.scrollTo(0);
    dispatch(setMode(modes.EDIT));
    dispatch(setMarkersVisible({ start: true, end: true }));
  }, [dispatch]);

  const hideSheet: () => void = useCallback(() => {
    dispatch(setCurrentRoute({
      start: null,
      end: null,
      id: 0,
    }));
  }, [dispatch]);

  const deleteRoute: (routeId: number) => Promise<void> = useCallback(
    async (routeId: number) => {
      const response = await delRoute({ routeId });
      await refetch();
      dispatch(setInitialState());
      modalRef.current?.setActive(false);
      bottomSheetRef.current?.scrollTo(0);
      hideSheet();
    },
    [delRoute, dispatch, hideSheet, refetch],
  );

  function findRoute(): void {
    if (!currentRoute.start || !currentRoute.end) return;
    if (!map.current) {
      console.log('no map');
      return;
    }

    map.current.findDrivingRoutes(
      [currentRoute.start, currentRoute.end],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (e: RouteEvent) => {
        const points = e.routes[0].sections.reduce(
          (acc: Point[], item: RouteSection) => [...acc, ...item.points],
          [],
        );

        dispatch(setPoints(points));
        dispatch(setMode(modes.ROUTE_ADDED));
      },
    );
  }

  function handleMapPress(event: NativeSyntheticEvent<Point>) {
    if (mode === modes.CREATE || mode === modes.EDIT) {
      const marker = currentMarker === CurrentMarker.START ? 'start' : 'end';
      dispatch(
        setCurrentRoute({
          ...currentRoute,
          [marker]: {
            lat: event.nativeEvent.lat,
            lon: event.nativeEvent.lon,
          },
        }),
      );
      dispatch(setMarkersVisible({ ...markersVisible, [marker]: true }));

      if (currentMarker === CurrentMarker.START && !markersVisible.start) {
        dispatch(setCurrentMarker(CurrentMarker.END));
      }
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <MapMarkers />

        <MapRoutes routes={routes} openSheet={openSheet} />
      </YaMap>

      <MapButtons
        handleSaveRoute={() =>
          navigation.navigate('SaveRoute', {
            points: points,
            currentRoute,
          })
        }
        findRoute={findRoute}
      />
      <BottomSheet hideSheet={hideSheet} ref={bottomSheetRef}>
        <BottomSheetContent
          deleteRoute={() => modalRef.current?.setActive(true)}
          editRoute={sheetPressEdit}
          routeId={currentRoute.id}
        />
      </BottomSheet>
      <DeleteModal
        modalRef={modalRef}
        deleteRoute={() => deleteRoute(currentRoute.id)}
        deleteLoading={deleteLoading}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
