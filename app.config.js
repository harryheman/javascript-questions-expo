const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.aio350.javascriptquestionsexpo.dev'
  }

  if (IS_PREVIEW) {
    return 'com.aio350.javascriptquestionsexpo.preview'
  }

  return 'com.aio350.javascriptquestionsexpo'
}

const getAppName = () => {
  if (IS_DEV) {
    return 'JavaScriptQuestionsExpo (Dev)'
  }

  if (IS_PREVIEW) {
    return 'JavaScriptQuestionsExpo (Preview)'
  }

  return 'JavaScriptQuestionsExpo'
}

export default {
  expo: {
    name: getAppName(),
    slug: 'javascript-questions-expo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: getUniqueIdentifier(),
      versionCode: '1',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '0ad379d0-e174-4c38-9a87-03cc82d8165f',
      },
    },
    updates: {
      url: 'https://u.expo.dev/0ad379d0-e174-4c38-9a87-03cc82d8165f',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
}
