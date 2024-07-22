import ParallaxScrollView from '@/components/ParallaxScrollView'
import SignInWithOAuth from '@/components/SignInWithOAuth'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo'
import type { ClerkAPIError } from '@clerk/types'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Button, HelperText, MD2Colors, TextInput } from 'react-native-paper'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()

  const onSignInPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        throw signInAttempt
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        setErrors(e.errors)
      }
      console.error(e)
    }
  }

  const disabled = !emailAddress.trim() || !password.trim()

  return (
    <ParallaxScrollView>
      <ThemedView style={{ padding: 16, gap: 16, height: '100%' }}>
        <ThemedView
          style={{
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ThemedText type='subtitle'>Авторизация</ThemedText>
          <Link href='/'>
            <TabBarIcon size={24} name='home' />
          </Link>
        </ThemedView>
        <ThemedView style={{ gap: 8 }}>
          <TextInput
            mode='outlined'
            value={emailAddress}
            placeholder='Email...'
            onChangeText={setEmailAddress}
          />
          <TextInput
            mode='outlined'
            value={password}
            placeholder='Пароль...'
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </ThemedView>
        {errors && (
          <ThemedView>
            {errors.map((el, index) => (
              <HelperText type='error' key={index}>
                {el.longMessage}
              </HelperText>
            ))}
          </ThemedView>
        )}
        <Button
          icon='login'
          onPress={onSignInPress}
          mode='contained'
          disabled={disabled}
          buttonColor={MD2Colors.green600}
          style={{ alignSelf: 'center' }}
        >
          Войти
        </Button>
        <SignInWithOAuth />
        <ThemedView
          style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
        >
          <ThemedText>Нет аккаунта?</ThemedText>
          <Link href='/sign-up'>
            <ThemedText type='link'>Зарегистрироваться</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  )
}
