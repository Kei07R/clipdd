import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GalleryStack from './GalleryStack';
import StylesScreen from '../screens/StylesScreen';
import ResultsScreen from '../screens/ResultsScreen';
import UploadScreen from '../screens/UploadScreen';
import { BottomTabParamList } from '../screens/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Styles: focused ? 'color-palette' : 'color-palette-outline',
            Results: focused ? 'sparkles' : 'sparkles-outline',
            Gallery: focused ? 'images' : 'images-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6c63ff',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          height: 64 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 11,
        },
      })}
    >
      <Tab.Screen name="Home" component={UploadScreen} />
      <Tab.Screen name="Styles" component={StylesScreen} />
      <Tab.Screen name="Results" component={ResultsScreen} />
      <Tab.Screen name="Gallery" component={GalleryStack} />
    </Tab.Navigator>
  );
}
