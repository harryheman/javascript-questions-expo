import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    ;(async () => {
      const item = await AsyncStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const item = JSON.stringify(value)
      await AsyncStorage.setItem(key, item)
    })()
    // eslint-disable-next-line
  }, [value])

  return [value, setValue] as const
}
