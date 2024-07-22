import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { ThemedView } from './ThemedView'
import { Button } from 'react-native-paper'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

const SignInWithOAuth = () => {
  useWarmUpBrowser()

  const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
    strategy: 'oauth_google',
  })
  const { startOAuthFlow: startOAuthFlowGithub } = useOAuth({
    strategy: 'oauth_github',
  })

  const onPressGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlowGoogle({
        redirectUrl: Linking.createURL('/', {
          scheme: 'myapp',
        }),
      })

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (e) {
      console.error(e)
    }
  }
  const onPressGithub = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlowGithub({
        redirectUrl: Linking.createURL('/', {
          scheme: 'myapp',
        }),
      })

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Button icon='google' onPress={onPressGoogle}>
        Google
      </Button>
      <Button icon='github' onPress={onPressGithub}>
        Github
      </Button>
    </ThemedView>
  )
}
export default SignInWithOAuth
