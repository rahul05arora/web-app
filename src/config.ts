import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the API base URL for all platforms:
 *
 * - Android Emulator:  Uses 10.0.2.2 (special alias that routes to the host machine)
 * - iOS Simulator:     Uses localhost (shares the host machine's network)
 * - Web Browser:       Uses localhost (running on the host machine itself)
 * - Physical Device:   Uses the dev machine's LAN IP (detected via Expo's hostUri)
 */
function getApiBaseUrl(): string {
  const PORT = 5000;

  if (Platform.OS === 'web') {
    return `http://localhost:${PORT}`;
  }

  if (Platform.OS === 'android') {
    // If running inside Expo Go on a physical Android device, Expo provides
    // the dev machine's LAN IP via hostUri (e.g. "192.168.1.42:8081").
    // If hostUri is not available, assume Android Emulator (10.0.2.2).
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const lanIp = hostUri.split(':')[0];
      // If the IP is localhost/127.0.0.1, we're in the emulator
      if (lanIp === 'localhost' || lanIp === '127.0.0.1') {
        return `http://10.0.2.2:${PORT}`;
      }
      return `http://${lanIp}:${PORT}`;
    }
    return `http://10.0.2.2:${PORT}`;
  }

  if (Platform.OS === 'ios') {
    // If running inside Expo Go on a physical iOS device, use the LAN IP.
    // If on the iOS Simulator, localhost works fine.
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const lanIp = hostUri.split(':')[0];
      if (lanIp !== 'localhost' && lanIp !== '127.0.0.1') {
        return `http://${lanIp}:${PORT}`;
      }
    }
    return `http://localhost:${PORT}`;
  }

  // Fallback
  return `http://localhost:${PORT}`;
}

export const API_BASE_URL = getApiBaseUrl();
