import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { useFonts } from 'expo-font';
import {
  IBMPlexSans_100Thin,
  IBMPlexSans_200ExtraLight,
  IBMPlexSans_300Light,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexMono_100Thin,
  IBMPlexMono_200ExtraLight,
  IBMPlexMono_300Light,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'IBM Plex Sans Thin': IBMPlexSans_100Thin,
    'IBM Plex Sans ExtraLight': IBMPlexSans_200ExtraLight,
    'IBM Plex Sans Light': IBMPlexSans_300Light,
    'IBM Plex Sans': IBMPlexSans_400Regular,
    'IBM Plex Sans Medium': IBMPlexSans_500Medium,
    'IBM Plex Sans SemiBold': IBMPlexSans_600SemiBold,
    'IBM Plex Sans Bold': IBMPlexSans_700Bold,
    'IBM Plex Mono Thin': IBMPlexMono_100Thin,
    'IBM Plex Mono ExtraLight': IBMPlexMono_200ExtraLight,
    'IBM Plex Mono Light': IBMPlexMono_300Light,
    'IBM Plex Mono': IBMPlexMono_400Regular,
    'IBM Plex Mono Medium': IBMPlexMono_500Medium,
    'IBM Plex Mono SemiBold': IBMPlexMono_600SemiBold,
    'IBM Plex Mono Bold': IBMPlexMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="bg-background justify-center items-center">
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="bg-background">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
