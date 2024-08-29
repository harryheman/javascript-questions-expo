import ParallaxScrollView from '@/components/ParallaxScrollView'
import { useTheme } from '@/components/ThemeProvider'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo'
import type { ClerkAPIError } from '@clerk/types'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Button, HelperText, MD2Colors, TextInput } from 'react-native-paper'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()

  const { theme } = useTheme()

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        setErrors(e.errors)
      }
      console.error(e)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        throw completeSignUp
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
          <ThemedText type='subtitle'>Регистрация</ThemedText>
          <Link href='/'>
            <TabBarIcon
              size={24}
              name='home'
              color={theme === 'light' ? 'black' : 'white'}
            />
          </Link>
        </ThemedView>
        {!pendingVerification && (
          <>
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
              onPress={onSignUpPress}
              mode='contained'
              icon='account'
              disabled={disabled}
              buttonColor={
                theme === 'light' ? MD2Colors.green600 : MD2Colors.green400
              }
              style={{ alignSelf: 'center' }}
            >
              Зарегистрироваться
            </Button>
          </>
        )}
        {pendingVerification && (
          <>
            <TextInput
              mode='outlined'
              value={code}
              placeholder='Код...'
              onChangeText={setCode}
            />
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
              onPress={onPressVerify}
              mode='contained'
              icon='email'
              buttonColor={
                theme === 'light' ? MD2Colors.green600 : MD2Colors.green400
              }
              style={{ alignSelf: 'center' }}
            >
              Подтвердить email
            </Button>
          </>
        )}

        <ThemedView
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <ThemedText>Есть аккаунт?</ThemedText>
          <Link href='/sign-in'>
            <ThemedText type='link'>Войти</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  )
}
