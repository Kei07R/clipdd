import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GalleryScreen from '../screens/GalleryScreen';
import { GalleryStackParamList } from '../screens/types';

const Stack = createNativeStackNavigator<GalleryStackParamList>();

export default function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GalleryHome" component={GalleryScreen} />
    </Stack.Navigator>
  );
}
