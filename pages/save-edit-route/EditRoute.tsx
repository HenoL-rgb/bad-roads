import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ImageSelector from '../../components/save-edit-page/ImageSelector';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { getUrl } from '../../utils/getUrl';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../AppWrapper';
import { transformRoute } from '../../utils/transformRoute';
import Description from '../../components/save-edit-page/Description';
import ObstacleType from '../../components/save-edit-page/ObstacleType/ObstacleType';
import Controls from '../../components/save-edit-page/Controls';
import TopIcon from '../../components/save-edit-page/TopIcon';
import ObstaclesDropDown from '../../components/save-edit-page/ObstacleType/ObstaclesDropDown';
import { ModalRefProps } from '../../components/modals/Modal';
import { Image } from 'react-native-image-crop-picker';
import * as assets from '../../pages/save-edit-route/assets';
import { Obstacle } from '../../types/SaveRouteQuery';
import { colors } from '../../utils/colors';
import {
  useSaveRouteMutation,
  useGetObstaclesQuery,
  useGetRouteByIdQuery,
} from '../../store/api/routes.api';
import {
  saveRouteAction,
  setInitialState,
} from '../../store/slices/routes.slice';

type EditRouteProps = NativeStackScreenProps<StackParamList, 'EditRoute'>;

type Info = {
  obstacle: {
    icon: keyof typeof assets;
    id: number;
    description: string;
  } | null;
  description: string | null;
  images: Image[] | {path: string}[];
};

export default function EditRoute({ navigation, route }: EditRouteProps) {
  const { points, currentRoute } = route.params;

  const theme = useAppSelector(state => state.themeReducer);
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const dispatch = useAppDispatch();
  const { data } = useGetRouteByIdQuery(currentRoute.id, {
    skip: currentRoute.id ? false : true,
  });
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
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
    if(!data) return;
    setInfo({
      obstacle: data.obstacle,
      description: data.description,
      images: data.images,
    })

  
  }, [data])

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

  function handleImages(images: Image[] | {path:string}[]) {
    setErrors({ ...errors, images: false });
    setInfo({ ...info, images: images });
  }
  //update correct

  async function handleSaveRoute(): Promise<void> {
    if (!userId || !info.obstacle) return;
    if (!info.images.length) {
      setErrors({ ...errors, images: true });
      return;
    }

    if (Object.values(errors).some(value => value === true)) return;
    getUrl(points);

    const response = await saveRoute({
      route: points,
      icon: getUrl(points),
      userId: userId,
      obstacleId: info.obstacle.id,
      description: info.description ? info.description : '',
      images: info.images.map(image => {
        if('data' in image) {
         return `${image.data}`
        }
        return image;
      }),
    });

    if ('data' in response) {
      dispatch(saveRouteAction(transformRoute(response.data)));
      dispatch(setInitialState());
    }
    navigation.navigate('Home', {
      screen: 'Map',
    });
  }

  if (isLoading) {
    return (
      <View style={[styles.wrapper, { backgroundColor: theme.colors.card }]}>
        <ActivityIndicator size="large" color={colors.blue} />
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
        handleSaveRoute={handleSaveRoute}
        Loading={saveLoading}
        mode="save"
        theme={theme}
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
  section: {
    borderRadius: 5,
  },
  content: {},
  contentContainer: {
    rowGap: 10,
  },
});
