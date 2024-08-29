import { Colors } from '@/constants/Colors'
import { useTheme } from 'react-native-paper'

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useTheme()
  const themeName = theme.dark ? 'dark' : 'light'
  const colorFromProps = props[themeName]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return Colors[themeName][colorName]
  }
}
