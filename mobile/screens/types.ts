import { NavigatorScreenParams } from '@react-navigation/native';

export type GalleryStackParamList = {
  GalleryHome: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Styles: undefined;
  Results: undefined;
  Gallery: NavigatorScreenParams<GalleryStackParamList>;
};

export type RootStackParamList = {
  Welcome: undefined;
  MainApp: undefined;
};
