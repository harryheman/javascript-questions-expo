import { useColorScheme } from '@/hooks/useColorScheme'
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { createClient } from '@supabase/supabase-js'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'
import ToastManager from 'toastify-react-native'

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      return item
    } catch (e) {
      console.error(e)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      SecureStore.setItemAsync(key, value)
    } catch (e) {
      console.error(e)
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Отсутствует ключ для Clerk.')
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Отсутствует URL или ключ Supabase')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastManager position='center' />
      <PaperProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkLoaded>
            <Stack>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='+not-found' />
            </Stack>
          </ClerkLoaded>
        </ClerkProvider>
      </PaperProvider>
    </ThemeProvider>
  )
}
