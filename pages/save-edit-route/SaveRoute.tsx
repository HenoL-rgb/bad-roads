import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import ImageSelector from './ImageSelector';
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
import ObstacleType from '../../components/save-edit-page/ObstacleType';
import Controls from '../../components/save-edit-page/Controls';
import TopIcon from '../../components/save-edit-page/TopIcon';

type SaveRouteProps = NativeStackScreenProps<StackParamList, 'SaveRoute'>;

export default function SaveRoute({ navigation, route }: SaveRouteProps) {
  const [saveRoute, { isLoading: saveLoading }] = useSaveRouteMutation();
  const [updateRoute, { isLoading: updateLoading }] = useUpdateRouteMutation();
  const userId = useAppSelector(state => state.userReducer.user?.id);
  const { points, currentRoute } = route.params;
  const theme = useAppSelector(state => state.themeReducer);
  const dispatch = useAppDispatch();

  //update correct
  async function handleSaveRoute(): Promise<void> {
    if (!userId) return;
    getUrl(points);

    if (currentRoute.id) {
      const response = await updateRoute({
        points,
        icon: getUrl(points),
        id: currentRoute.id,
      });
      console.log(response);
    } else {
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
        <ObstacleType theme={theme} />
        <View style={styles.section}>
          <ImageSelector />
        </View>
        <Description />
      </ScrollView>

      <Controls
        handleCancel={() => navigation.goBack()}
        handleSaveRoute={handleSaveRoute}
        Loading={saveLoading}
        mode='save'
        theme={theme}
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
  content: {
  },
  contentContainer: {
    rowGap: 10,
  },
});
