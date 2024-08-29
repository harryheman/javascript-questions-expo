import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Avatar, Button, Icon, MD2Colors } from 'react-native-paper'
import { useTheme } from './ThemeProvider'
import { TouchableOpacity } from 'react-native'

export default function AuthPanel() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [loading, setLoading] = useState(false)

  const { theme, setTheme } = useTheme()

  const onSignOutPress = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  return (
    <>
      <SignedIn>
        <ThemedView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <ThemedView
            style={{
              alignItems: 'center',
            }}
          >
            {user?.hasImage && (
              <Avatar.Image
                size={36}
                source={{
                  uri: user.imageUrl,
                }}
              />
            )}
            <ThemedText>{user?.fullName}</ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              gap: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon
                source={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
                size={18}
              />
            </TouchableOpacity>
            <Button
              icon='logout'
              mode='contained'
              onPress={onSignOutPress}
              loading={loading}
              disabled={loading}
              buttonColor={
                theme === 'light' ? MD2Colors.blue600 : MD2Colors.blue400
              }
            >
              Выйти
            </Button>
          </ThemedView>
        </ThemedView>
      </SignedIn>
      <SignedOut>
        <ThemedView
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            gap: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Icon
              source={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
              size={18}
            />
          </TouchableOpacity>
          <Link href='/sign-in'>
            <Button
              icon='login'
              mode='contained'
              buttonColor={
                theme === 'light' ? MD2Colors.blue600 : MD2Colors.blue400
              }
            >
              Войти
            </Button>
          </Link>
        </ThemedView>
      </SignedOut>
    </>
  )
}
