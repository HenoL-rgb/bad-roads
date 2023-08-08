import { Point } from 'react-native-yamap';

import { ImageOrVideoType } from '../ImageType';
import { MapCurrentRoute } from '../Route';

export enum rootScreens {
  Home = 'Home',
  SettingsWrapper = 'SettingsWrapper',
  Gallery = 'Gallery',
  SaveRoute = 'SaveRoute',
  EditRoute = 'EditRoute',
}

export type StackParamList = {
  [rootScreens.Home]: {
    screen: 'Map' | 'Account';
  };
  [rootScreens.SettingsWrapper]: undefined;
  [rootScreens.Gallery]: {
    images: ImageOrVideoType[];
    clickedId: number;
  };
  [rootScreens.SaveRoute]: {
    points: Point[];
    currentRoute: MapCurrentRoute;
  };
  [rootScreens.EditRoute]: {
    points: Point[];
    currentRoute: MapCurrentRoute;
  };
};
