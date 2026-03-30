import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { generateStyles } from '../services/api';
import { saveToGallery } from '../services/storage';

import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useImage } from '../context/ImageContext';
import { BottomTabParamList } from './types';

type NavProp = BottomTabNavigationProp<BottomTabParamList, 'Styles'>;

const PRESETS = [
  { key: 'anime',    label: 'Anime',     image: require('../assets/anime-style.jpg') },
  { key: 'ghibli',   label: 'Ghibli',    image: require('../assets/ghibli-style.jpg') },
  { key: 'pixelart', label: 'Pixel Art', image: require('../assets/pixel-style.jpg') },
  { key: 'comic',    label: 'Comic',     image: require('../assets/comic-style.jpg') },
  { key: 'cartoon',  label: 'Cartoon',   image: require('../assets/cartoon-style.jpg') },
];

const ALL_PRESET_KEYS = PRESETS.map((p) => p.key);

function friendlyError(err: any): string {
  const msg: string = err?.message ?? '';
  if (msg.includes('Network') || msg.includes('fetch') || msg.includes('Failed to fetch')) {
    return 'Connection failed. Check your internet and try again.';
  }
  if (msg.includes('timeout') || msg.includes('Timeout')) {
    return 'This is taking too long. Please try again.';
  }
  if (msg.includes('429') || msg.toLowerCase().includes('rate limit')) {
    return 'Too many requests. Wait a moment and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function StylesScreen() {
  const navigation = useNavigation<NavProp>();
  const { imageUri, setResults } = useImage();

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(ALL_PRESET_KEYS));
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCustomActive = customPrompt.trim().length > 0;
  const canGenerate = !!imageUri && (selectedKeys.size > 0 || isCustomActive) && !loading;

  function togglePreset(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleGenerate() {
    if (!imageUri) return;
    setError(null);
    setLoading(true);

    const styleKeys = [...selectedKeys];
    if (isCustomActive) styleKeys.push('custom');

    try {
      const results = await generateStyles(
        imageUri,
        styleKeys,
        isCustomActive ? customPrompt.trim() : undefined
      );

      // Save successful results to gallery
      const toSave = results
        .filter((r) => r.imageUrl)
        .map((r) => ({
          remoteUrl: r.imageUrl!,
          style: r.style,
          label: r.label,
          originalImageUri: imageUri,
        }));
      await saveToGallery(toSave as any);
      setResults(results);
      navigation.navigate('Results');
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>CLIPDD</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        {/* <Text style={styles.eyebrow}>STYLE LAB</Text> */}
        <Text style={styles.heading}>Craft Your Style</Text>
        {!imageUri ? (
          <Text style={[styles.subheading, { color: '#e94560' }]}>
            Please select an image first from the Home tab.
          </Text>
        ) : (
          <Text style={styles.subheading}>
            Select a preset aesthetic or define your unique visual signature.
          </Text>
        )}

        {/* Presets */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Presets</Text>
        </View>

        <View style={styles.grid}>
          {PRESETS.map((preset) => {
            const selected = selectedKeys.has(preset.key);
            return (
              <TouchableOpacity
                key={preset.key}
                style={[styles.card, selected && styles.cardSelected]}
                activeOpacity={0.85}
                onPress={() => togglePreset(preset.key)}
              >
                <ImageBackground source={preset.image} style={styles.cardBg} resizeMode="cover">
                  {selected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                  <Text style={styles.cardLabel}>{preset.label}</Text>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Vision */}
        <View style={styles.customHeader}>
          <Ionicons name="sparkles" size={20} color={isCustomActive ? '#6c63ff' : '#333'} />
          <Text style={[styles.customTitle, isCustomActive && styles.customTitleActive]}>
            Custom Vision
          </Text>
        </View>

        <TextInput
          style={[styles.customInput, isCustomActive && styles.customInputActive]}
          placeholder="Describe your visual style... (e.g., '1970s disco aesthetics with holographic overlays')"
          placeholderTextColor="#bbb"
          multiline
          value={customPrompt}
          onChangeText={setCustomPrompt}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Loading modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color="#6c63ff" />
            <Text style={styles.modalTitle}>Generating your images…</Text>
            <Text style={styles.modalSubtitle}>
              Please be patient, this usually takes a minute or two.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Generate button */}
      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.generateBtn, !canGenerate && styles.generateBtnDisabled]}
          activeOpacity={0.85}
          disabled={!canGenerate}
          onPress={handleGenerate}
        >
          <Text style={styles.generateBtnText}>
            {loading ? 'Generating…' : 'Generate Images'}
          </Text>
          <Ionicons name="flash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

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
    paddingTop: 52,
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
    paddingTop: 8,
  },
  eyebrow: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#6c63ff',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  heading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#111',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  card: {
    width: '47.5%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#6c63ff',
  },
  cardBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#6b63ff88',
    paddingHorizontal: 10,
    paddingVertical: 2,
    margin: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  customTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#111',
  },
  customTitleActive: {
    color: '#6c63ff',
  },
  customInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: 'transparent',
    lineHeight: 22,
  },
  customInputActive: {
    borderColor: '#6c63ff',
  },
  bottomSpacer: {
    height: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#f0f0f8',
  },
  generateBtn: {
    backgroundColor: '#6c63ff',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateBtnDisabled: {
    opacity: 0.4,
  },
  generateBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    color: '#e94560',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
    gap: 16,
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: '#111',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});
