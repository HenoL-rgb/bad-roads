import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  NativeSyntheticEvent,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import YaMap from 'react-native-yamap';

import BottomSheetContent from '../../components/BottomSheet/bottom-sheet-content/BottomSheetContent';
import BottomSheet, {
  BottomSheetRefProps,
} from '../../components/BottomSheet/BottomSheet';
import DeleteModal from '../../components/modals/DeleteModal';
import { ModalRefProps } from '../../components/modals/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import useGetAllRoutes from '../../hooks/useGetAllRoutes';
import { StackParamList, rootScreens } from '../../navigation/AppWrapper';
import { useDeleteRouteMutation } from '../../store/api/routes.api';
import {
  setMode,
  setMarkersVisible,
  setCurrentRoute,
  setInitialState,
  setCurrentMarker,
  setPoints,
  deleteRouteAction,
} from '../../store/slices/routes.slice';
import { Point } from '../../types/Point';
import { RouteSection } from '../../types/Route';
import { RouteEvent } from '../../types/RouteEvent';
import { HomeScreens, TabNavParamList } from '../Home';

import MapButtons from './components/MapButtons';
import MapMarkers from './components/MapMarkers';
import MapRoutes from './components/MapRoutes';

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
type Props = NativeStackScreenProps<TabNavParamList, HomeScreens.Map>;
type RootNavigation = NativeStackNavigationProp<StackParamList>;

export default function Map({ route }: Props) {
  const initialParams = route.params;

  const { mode, currentMarker, currentRoute, markersVisible, points } =
    useAppSelector(state => state.routesReducer);

  const dispatch = useAppDispatch();
  const { routes, isLoading } = useGetAllRoutes();
  const map = useRef<YaMap>(null);
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const modalRef = useRef<ModalRefProps>(null);
  const [delRoute, { isLoading: deleteLoading }] = useDeleteRouteMutation();
  const navigation = useNavigation<RootNavigation>();
  const theme = useAppSelector(state => state.themeReducer);
  const [findLoading, setFindLoading] = useState<boolean>(false);

  const openSheet: () => void = useCallback(() => {
    bottomSheetRef.current?.scrollTo(-350);
  }, []);

  const sheetPressEdit: () => void = useCallback(() => {
    bottomSheetRef.current?.scrollTo(0);
    dispatch(setMode(modes.EDIT));
    dispatch(setMarkersVisible({ start: true, end: true }));
  }, [dispatch]);

  const hideSheet: () => void = useCallback(() => {
    dispatch(
      setCurrentRoute({
        start: null,
        end: null,
        id: 0,
      }),
    );
  }, [dispatch]);

  const deleteRoute: (routeId: number) => Promise<void> = useCallback(
    async (routeId: number) => {
      await delRoute({ routeId });
      dispatch(deleteRouteAction({ routeId }));
      dispatch(setInitialState());
      modalRef.current?.setActive(false);
      bottomSheetRef.current?.scrollTo(0);
      hideSheet();
    },
    [delRoute, dispatch, hideSheet],
  );

  function findRoute(): void {
    if (!currentRoute.start || !currentRoute.end) return;
    if (!map.current) {
      return;
    }
    setFindLoading(true);
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
        setFindLoading(false);
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

  function handleSaveRoute() {
    if (!currentRoute.id) {
      navigation.navigate(rootScreens.SaveRoute, {
        points: points,
        currentRoute,
      });
      return;
    }

    navigation.navigate(rootScreens.EditRoute, {
      points: points,
      currentRoute,
    });
    return;
  }

  useFocusEffect(
    useCallback(() => {
      dispatch(setInitialState());
    }, [dispatch]),
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingWrapper,
          { backgroundColor: theme.colors.background },
        ]}>
        <ActivityIndicator size="large" color={theme.colors.activity} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <YaMap
        showUserPosition={false}
        onMapPress={handleMapPress}
        style={styles.wrapper}
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
        handleSaveRoute={handleSaveRoute}
        findRoute={findRoute}
        findLoading={findLoading}
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

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
  },
});
