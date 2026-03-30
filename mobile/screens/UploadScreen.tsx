import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImage } from '../context/ImageContext';
import { BottomTabParamList } from './types';

type NavProp = BottomTabNavigationProp<BottomTabParamList, 'Home'>;

export default function UploadScreen() {
  const navigation = useNavigation<NavProp>();
  const { imageUri, setImageUri } = useImage();
  const insets = useSafeAreaInsets();

  async function openCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function openGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
      >

        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.appName}>CLIPDD</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Your photo.{'\n'}Every art style.</Text>
        <Text style={styles.subheading}>
          Transform ordinary moments into curated masterpieces.
        </Text>

        {/* Upload zone */}
        <TouchableOpacity style={styles.uploadZone} activeOpacity={0.8} onPress={openGallery}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setImageUri(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIconCircle}>
                <Ionicons name="image" size={32} color="#6c63ff" />
              </View>
              <Text style={styles.uploadText}>Tap to upload</Text>
              <Text style={styles.uploadSubtext}>High resolution JPG or PNG supported</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Camera button */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={openCamera}>
          <Ionicons name="camera" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>CAMERA</Text>
        </TouchableOpacity>

        {/* Choose Style row */}
        <TouchableOpacity
          style={[styles.chooseStyleRow, !imageUri && styles.chooseStyleRowDisabled]}
          activeOpacity={0.75}
          disabled={!imageUri}
          onPress={() => navigation.navigate('Styles')}
        >
          <View style={styles.chooseStyleLeft}>
            <View style={styles.chooseStyleIconCircle}>
              <Ionicons name="color-palette" size={20} color="#6c63ff" />
            </View>
            <View>
              <Text style={styles.chooseStyleLabel}>NEXT STEP</Text>
              <Text style={styles.chooseStyleTitle}>Choose Style</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color="#6c63ff" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f8',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  topBar: {
    paddingTop: 52,
    paddingBottom: 16,
    alignItems: 'center',
  },
  appName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#6c63ff',
    letterSpacing: 2,
  },
  heading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#111',
    lineHeight: 42,
    marginBottom: 10,
  },
  subheading: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
    marginBottom: 24,
  },
  uploadZone: {
    width: '100%',
    height: 240,
    borderWidth: 2,
    borderColor: '#6c63ff',
    borderStyle: 'dashed',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8ff',
    marginBottom: 20,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 10,
  },
  uploadIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(108,99,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#6c63ff',
  },
  uploadSubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#aaa',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6c63ff',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnDisabled: {
    opacity: 0.4,
  },
  actionBtnText: {
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    fontSize: 13,
    letterSpacing: 1,
  },
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#aaa',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  selectionRowActive: {
    borderWidth: 1,
    borderColor: '#6c63ff',
  },
  selectionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108,99,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#111',
    flex: 1,
    letterSpacing: 0.5,
  },
  chooseStyleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#6c63ff',
  },
  chooseStyleRowDisabled: {
    opacity: 0.4,
    borderColor: '#ccc',
  },
  chooseStyleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chooseStyleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108,99,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseStyleLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#6c63ff',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  chooseStyleTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#111',
  },
});
