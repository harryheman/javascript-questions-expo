import type { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'

import { ThemedView } from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = PropsWithChildren<{}>

export default function ParallaxScrollView({ children }: Props) {
  return (
    <SafeAreaView style={{ minHeight: '100%' }}>
      <ThemedView style={styles.container}>
        <Animated.ScrollView scrollEventThrottle={16}>
          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.ScrollView>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
})
