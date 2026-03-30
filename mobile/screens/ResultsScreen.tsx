import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import {
  Alert,
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

type NavProp = BottomTabNavigationProp<BottomTabParamList, 'Results'>;

const STYLE_LABELS: Record<string, string> = {
  anime: 'ANIME',
  ghibli: 'GHIBLI',
  pixelart: 'PIXELART',
  comic: 'COMIC',
  cartoon: 'CARTOON',
  custom: 'CUSTOM',
};

export default function ResultsScreen() {
  const navigation = useNavigation<NavProp>();
  const { imageUri, results } = useImage();
  const insets = useSafeAreaInsets();

  async function handleShare(imageUrl: string) {
    try {
      const filename = `clipdd_share_${Date.now()}.jpg`;
      const dir = FileSystem.cacheDirectory;
      if (!dir) throw new Error('Storage unavailable');
      const fileUri = dir + filename;
      await FileSystem.downloadAsync(imageUrl, fileUri);
      await Sharing.shareAsync(fileUri, { mimeType: 'image/jpeg' });
    } catch {
      Alert.alert('Share Failed', 'Could not share this image. Please try again.');
    }
  }

  async function handleDownload(imageUrl: string) {
    try {
      const filename = `clipdd_${Date.now()}.jpg`;
      const dir = FileSystem.documentDirectory;
      if (!dir) throw new Error('Storage unavailable');
      const fileUri = dir + filename;
      await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.createAssetAsync(fileUri);
      Alert.alert('Saved!', 'Image saved to your gallery.');
    } catch {
      Alert.alert('Download Failed', 'Could not save this image. Please try again.');
    }
  }

  return (
    <View style={styles.container}>

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.appName}>CLIPDD</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Original image */}
        <View style={styles.originalCard}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.originalThumb} /> : <View style={styles.originalThumb} />}
          <View>
            <Text style={styles.originalTitle}>ORIGINAL CAPTURE</Text>
            <Text style={styles.originalSub}>Your uploaded photo</Text>
          </View>
        </View>

        {/* Section header */}
        <Text style={styles.eyebrow}>GENERATIONS</Text>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>AI Style Iterations</Text>
        </View>

        {/* Empty state */}
        {results.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="sparkles-outline" size={52} color="#ccc" />
            <Text style={styles.emptyTitle}>No results yet</Text>
            <Text style={styles.emptySubtext}>
              Head to Styles, pick your aesthetics, and hit Generate.
            </Text>
          </View>
        )}

        {/* Results grid */}
        <View style={styles.grid}>
          {results.map((result) => (
            <View key={result.style} style={styles.card}>
              {result.imageUrl ? (
                <>
                  <Image source={{ uri: result.imageUrl }} style={styles.cardImage} />
                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={() => handleShare(result.imageUrl!)}
                  >
                    <Ionicons name="share-social-outline" size={20} color="#6c63ff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => handleDownload(result.imageUrl!)}
                  >
                    <Ionicons name="download-outline" size={20} color="#6c63ff" />
                  </TouchableOpacity>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardLabel}>{STYLE_LABELS[result.style] ?? result.label.toUpperCase()}</Text>
                    <View style={styles.readyBadge}>
                      <Text style={styles.readyBadgeText}>READY</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.errorCard}>
                    <Ionicons name="alert-circle-outline" size={28} color="#ccc" />
                    <Text style={styles.errorCardText}>Failed</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={[styles.cardLabel, styles.cardLabelMuted]}>
                      {STYLE_LABELS[result.style] ?? result.label.toUpperCase()}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ))}

          {/* Add style card */}
          <TouchableOpacity style={[styles.card, styles.addStyleCard]} onPress={() => navigation.navigate('Styles')}>
            <Ionicons name="add-circle-outline" size={32} color="#ccc" />
            <Text style={styles.addStyleText}>ADD STYLE</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f8',
  },
  topBar: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  appName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#6c63ff',
    letterSpacing: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  originalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    marginBottom: 24,
  },
  originalThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  originalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: '#111',
    letterSpacing: 0.5,
  },
  originalSub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  eyebrow: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#6c63ff',
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#111',
  },
  refineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e8e8f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refineBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47.5%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
  },
  shareBtn: {
    position: 'absolute',
    bottom: 48,
    right: 54,
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  downloadBtn: {
    position: 'absolute',
    bottom: 48,
    right: 10,
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    color: '#111',
    letterSpacing: 0.5,
  },
  cardLabelMuted: {
    color: '#aaa',
  },
  readyBadge: {
    backgroundColor: 'rgba(108,99,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  readyBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#6c63ff',
    letterSpacing: 0.5,
  },
  errorCard: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    gap: 8,
  },
  errorCardText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#ccc',
  },
  addStyleCard: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f8',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    gap: 8,
  },
  addStyleText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#ccc',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#aaa',
  },
  emptySubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
