import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GalleryItem, loadGallery, deleteFromGallery } from '../services/storage';

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<GalleryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadGallery().then(setItems);
    }, [])
  );

  async function handleDownload(item: GalleryItem) {
    try {
      await MediaLibrary.createAssetAsync(item.localUri);
      Alert.alert('Saved!', 'Image saved to your gallery.');
    } catch {
      Alert.alert('Download Failed', 'Could not save this image. Please try again.');
    }
  }

  async function handleDelete(id: string) {
    Alert.alert('Delete image', 'Remove this image from your gallery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteFromGallery(id);
          setItems((prev) => prev.filter((i) => i.id !== id));
        },
      },
    ]);
  }

  const renderItem = ({ item }: { item: GalleryItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.localUri }} style={styles.cardImage} />
      <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(item)}>
        <Ionicons name="download-outline" size={20} color="#6c63ff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>CLIPDD</Text>
      </View>

      {/* Heading */}
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Your Gallery</Text>
        <View style={styles.headingUnderline} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="images-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No images yet</Text>
          <Text style={styles.emptySubtext}>Generate some styles to see them here</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f8',
    paddingHorizontal: 20,
  },
  topBar: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#6c63ff',
    letterSpacing: 2,
  },
  headingRow: {
    marginBottom: 28,
  },
  heading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: '#111',
    marginBottom: 8,
  },
  headingUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#6c63ff',
    borderRadius: 2,
  },
  grid: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48.5%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  downloadBtn: {
    position: 'absolute',
    bottom: 10,
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#aaa',
  },
  emptySubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#ccc',
  },
});
