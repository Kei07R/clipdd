import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const GALLERY_KEY = 'clipdd_gallery';

export type GalleryItem = {
  id: string;
  localUri: string;
  style: string;
  label: string;
  originalImageUri: string;
  createdAt: number;
};

export async function saveToGallery(items: Omit<GalleryItem, 'id' | 'localUri' | 'createdAt'>[] & { remoteUrl: string }[]): Promise<void> {
  const existing = await loadGallery();

  const downloaded: GalleryItem[] = [];

  for (const item of items) {
    try {
      const filename = `clipdd_${Date.now()}_${item.style}.jpg`;
      const localUri = FileSystem.documentDirectory + filename;
      await FileSystem.downloadAsync((item as any).remoteUrl, localUri);
      downloaded.push({
        id: `${Date.now()}_${item.style}`,
        localUri,
        style: item.style,
        label: item.label,
        originalImageUri: item.originalImageUri,
        createdAt: Date.now(),
      });
    } catch {
      // skip failed downloads silently
    }
  }

  const updated = [...downloaded, ...existing];
  await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
}

export async function loadGallery(): Promise<GalleryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function deleteFromGallery(id: string): Promise<void> {
  const existing = await loadGallery();
  const item = existing.find((i) => i.id === id);
  if (item) {
    await FileSystem.deleteAsync(item.localUri, { idempotent: true });
  }
  const updated = existing.filter((i) => i.id !== id);
  await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
}
