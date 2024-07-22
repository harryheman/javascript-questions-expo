import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Avatar, Button, MD2Colors } from 'react-native-paper'

type Props = {}

export default function AuthPanel({}: Props) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [loading, setLoading] = useState(false)

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
          <Button
            icon='logout'
            mode='contained'
            onPress={onSignOutPress}
            disabled={loading}
            buttonColor={MD2Colors.blue600}
          >
            Выйти
          </Button>
        </ThemedView>
      </SignedIn>
      <SignedOut>
        <ThemedView style={{ alignItems: 'flex-end' }}>
          <Link href='/sign-in'>
            <Button
              icon='login'
              mode='contained'
              buttonColor={MD2Colors.blue600}
            >
              Войти
            </Button>
          </Link>
        </ThemedView>
      </SignedOut>
    </>
  )
}
