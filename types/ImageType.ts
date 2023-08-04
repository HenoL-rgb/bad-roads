import { Image, ImageOrVideo } from 'react-native-image-crop-picker';

export type ImageType = Image | { path: string };

export type ImageOrVideoType = ImageOrVideo | { path: string };
