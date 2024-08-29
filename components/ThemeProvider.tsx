import { createContext, useContext, useState } from 'react'
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}>({
  theme: 'light',
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <PaperProvider theme={theme === 'dark' ? MD3DarkTheme : MD3LightTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  )
}
