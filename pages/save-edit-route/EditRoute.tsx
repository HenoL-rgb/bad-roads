import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import { ModalRefProps } from '../../components/modals/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { rootScreens, StackParamList } from '../../navigation/AppWrapper';
import {
  useGetObstaclesQuery,
  useGetRouteByIdQuery,
  useUpdateRouteMutation,
} from '../../store/api/routes.api';
import {
  saveRouteAction,
  setInitialState,
} from '../../store/slices/routes.slice';
import { ImageType } from '../../types/ImageType';
import { Obstacle } from '../../types/SaveRouteQuery';
import { getUrl } from '../../utils/getUrl';
import { transformRoute } from '../../utils/transformRoute';

import * as assets from './assets';
import Controls from './components/Controls';
import Description from './components/Description';
import ImageSelector from './components/ImageSelector';
import ObstaclesDropDown from './components/ObstacleType/ObstaclesDropDown';
import ObstacleType from './components/ObstacleType/ObstacleType';
import TopIcon from './components/TopIcon';

type EditRouteProps = NativeStackScreenProps<
  StackParamList,
  rootScreens.EditRoute
>;

type Info = {
  obstacle: {
    icon: keyof typeof assets;
    id: number;
    description: string;
  } | null;
  description: string | null;
  images: ImageType[];
};

export default function EditRoute({ navigation, route }: EditRouteProps) {
  const { points, currentRoute } = route.params;

  const theme = useAppSelector(state => state.themeReducer);
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const dispatch = useAppDispatch();
  const { data } = useGetRouteByIdQuery(currentRoute.id, {
    skip: currentRoute.id ? false : true,
  });
  const [updateRoute, { isLoading: saveLoading }] = useUpdateRouteMutation();
  const { data: obstaclesData, isLoading } = useGetObstaclesQuery();

  const [info, setInfo] = useState<Info>({
    obstacle: null,
    description: null,
    images: [],
  });
  const [errors, setErrors] = useState({
    images: false,
  });

  useEffect(() => {
    if (!data) return;
    setInfo({
      obstacle: data.obstacle,
      description: data.description,
      images: data.images,
    });
  }, [data]);

  const ref = useRef<ModalRefProps>(null);

  const setObstacle = (id: number) => {
    const obstacleFound = obstaclesData?.find(
      (item: Obstacle) => item.id === id,
    );

    if (!obstacleFound || !ref.current) {
      return;
    }

    setInfo({
      ...info,
      obstacle: {
        icon: obstacleFound.icon,
        id: obstacleFound.id,
        description: obstacleFound.description,
      },
    });
    ref.current.setActive(false);
  };

  function handleModalActive() {
    if (!ref.current) {
      return;
    }

    ref.current.setActive(true);
  }

  function handleImages(images: ImageType[]) {
    setErrors({ ...errors, images: false });
    setInfo({ ...info, images: images });
  }

  async function handleUpdateRoute(): Promise<void> {
    if (!userId || !info.obstacle) return;
    if (!info.images.length) {
      setErrors({ ...errors, images: true });
      return;
    }

    if (Object.values(errors).some(value => value === true)) return;
    getUrl(points);

    const response = await updateRoute({
      route: points,
      icon: getUrl(points),
      routeId: currentRoute.id,
      userId: userId,
      obstacleId: info.obstacle.id,
      description: info.description ? info.description : '',
      images: info.images.map(image => {
        if ('data' in image) {
          return `${image.data}`;
        }
        return image;
      }),
    });

    if ('data' in response) {
      dispatch(saveRouteAction(transformRoute(response.data)));
      dispatch(setInitialState());
    }
    navigation.navigate(rootScreens.Home, {
      screen: 'Map',
    });
  }

  if (isLoading) {
    return (
      <View
        style={[styles.loadingWrapper, { backgroundColor: theme.colors.card }]}>
        <ActivityIndicator size="large" color={theme.colors.activity} />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.card }]}>
      <TopIcon name="save" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <ObstacleType
          theme={theme}
          setModalActive={handleModalActive}
          Obstacle={info.obstacle?.icon ?? null}
        />
        <View style={styles.section}>
          <ImageSelector images={info.images} setImages={handleImages} />
          {errors.images && (
            <Text style={{ color: theme.colors.text }}>No selected images</Text>
          )}
        </View>
        <Description
          theme={theme}
          description={info.description}
          setDescription={value => setInfo({ ...info, description: value })}
        />
      </ScrollView>

      <Controls
        handleCancel={() => navigation.goBack()}
        handleSaveRoute={handleUpdateRoute}
        Loading={saveLoading}
        mode="update"
        theme={theme}
        saveDisabled={!info.images.length || !info.obstacle}
      />
      {obstaclesData && (
        <ObstaclesDropDown
          theme={theme}
          data={obstaclesData}
          modalRef={ref}
          setObstacle={value => setObstacle(value)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    borderRadius: 5,
  },
  content: {},
  contentContainer: {
    rowGap: 10,
  },
});
