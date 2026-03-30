import { StyleResult } from '../services/api';

export type RootStackParamList = {
  Welcome: undefined;
  Upload: undefined;
  Styles: { imageUri: string };
  Results: { imageUri: string; results: StyleResult[] };
};
