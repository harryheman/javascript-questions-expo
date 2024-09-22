import { ThemeProvider } from '@/components/ThemeProvider'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
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

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL

if (!convexUrl) {
  throw new Error('Отсутствует URL Convex')
}

const convex = new ConvexReactClient(convexUrl)

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
    <ThemeProvider>
      <ToastManager
        position='center'
        textStyle={{
          fontSize: 16,
        }}
      />
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Stack>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='+not-found' />
            </Stack>
          </ConvexProviderWithClerk>
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  )
}
