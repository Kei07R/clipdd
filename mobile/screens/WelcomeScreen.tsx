import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.quote}>
          Every photo tells a story.{'\n'}Let AI reimagine yours.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('MainApp')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f8',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 24,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#9c98e9',
  },
  quote: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#6c63ff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
