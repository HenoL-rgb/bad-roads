import { View, ScrollView, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import ImageSelector from '../../components/save-edit-page/ImageSelector';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  useSaveRouteMutation,
  useUpdateRouteMutation,
} from '../../store/api/routes.api';
import { getUrl } from '../../utils/getUrl';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../AppWrapper';
import {
  saveRouteAction,
  setInitialState,
} from '../../store/slices/routes.slice';
import { transformRoute } from '../../utils/transformRoute';
import Description from '../../components/save-edit-page/Description';
import ObstacleType from '../../components/save-edit-page/ObstacleType/ObstacleType';
import Controls from '../../components/save-edit-page/Controls';
import TopIcon from '../../components/save-edit-page/TopIcon';
import ObstaclesDropDown from '../../components/save-edit-page/ObstacleType/ObstaclesDropDown';
import { ModalRefProps } from '../../components/modals/Modal';
import { SvgProps } from 'react-native-svg';
import { Other } from './assets';
import { ImageOrVideo } from 'react-native-image-crop-picker';

type SaveRouteProps = NativeStackScreenProps<StackParamList, 'SaveRoute'>;

type Info = {
  obstacle: {
    icon: React.FC<SvgProps>;
    id: number;
  } | null;
  description: string | null;
  images: ImageOrVideo[];
};

const data = [
  {
    id: 1,
    icon: Other,
    description:
      'Указатель предупреждает участников дорожного движения' +
      ' о подъезде к участку дороги, на котором имеются опасности,' +
      ' не предусмотренные другими предупреждающими знаками',
  },
  {
    id: 2,
    icon: Other,
    description:
      'Указатель предупреждает участников дорожного движения' +
      ' о подъезде к участку дороги, на котором имеются опасности,' +
      ' не предусмотренные другими предупреждающими знаками',
  },
  {
    id: 3,
    icon: Other,
    description:
      'Указатель предупреждает участников дорожного движения' +
      ' о подъезде к участку дороги, на котором имеются опасности,' +
      ' не предусмотренные другими предупреждающими знаками',
  },
  {
    id: 4,
    icon: Other,
    description:
      'Указатель предупреждает участников дорожного движения' +
      ' о подъезде к участку дороги, на котором имеются опасности,' +
      ' не предусмотренные другими предупреждающими знаками',
  },
  {
    id: 5,
    icon: Other,
    description:
      'Указатель предупреждает участников дорожного движения' +
      ' о подъезде к участку дороги, на котором имеются опасности,' +
      ' не предусмотренные другими предупреждающими знаками',
  },
];

export default function SaveRoute({ navigation, route }: SaveRouteProps) {
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
  const [info, setInfo] = useState<Info>({
    obstacle: null,
    description: null,
    images: [],
  });
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const { points } = route.params;
  const theme = useAppSelector(state => state.themeReducer);
  const dispatch = useAppDispatch();
  const ref = useRef<ModalRefProps>(null);

  const setObstacle = (id: number) => {
    const obstacleFound = data.find(item => item.id === id);
    if (!obstacleFound || !ref.current) {
      return;
    }

    setInfo({
      ...info,
      obstacle: {
        icon: obstacleFound.icon,
        id: obstacleFound.id,
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
  //update correct
  async function handleSaveRoute(): Promise<void> {
    if (!userId) return;
    getUrl(points);

    try {
      const response = await saveRoute({
        route: points,
        icon: getUrl(points),
        userId: userId,
      });
      if ('data' in response) {
        dispatch(saveRouteAction(transformRoute(response.data)));
        dispatch(setInitialState());
      }
    } catch (error) {
      console.log(error);
    }

    navigation.navigate('Home', {
      screen: 'Map',
    });
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
          <ImageSelector images={info.images} setImages={(images) => setInfo({...info, images: images})} />
        </View>
        <Description
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
      <ObstaclesDropDown
        data={data}
        modalRef={ref}
        obstacle={info.obstacle}
        setObstacle={value => setObstacle(value)}
      />
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
