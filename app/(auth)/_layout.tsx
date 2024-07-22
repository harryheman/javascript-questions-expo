import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import ParallaxScrollView from '@/components/ParallaxScrollView'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href='/' />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
