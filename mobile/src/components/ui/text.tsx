import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'

interface TextProps {
  variant?: 'default' | 'inherit' | 'muted' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
  size?: 'default' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'heading-01' | 'heading-02' | 'heading-03' | 'heading-04' | 'heading-05'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  children: React.ReactNode
  style?: TextStyle
}

const TextComponent: React.FC<TextProps> = ({
  variant = 'inherit',
  size = 'default',
  weight = 'normal',
  children,
  style,
}) => {
  const variantStyle = styles[variant] || {}
  const sizeStyle = styles[size] || {}
  const weightStyle = styles[weight] || {}

  return (
    <Text style={[variantStyle, sizeStyle, weightStyle, style]}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  default: {},
  inherit: {},
  muted: { color: '#6F6F6F' },
  primary: { color: '#0F62FE' },
  secondary: { color: '#FFFFFF' },
  error: { color: '#DA1E28' },
  success: { color: '#24A148' },
  warning: { color: '#F1C21B' },
  info: { color: '#0043CE' },
  xs: { fontSize: 12 },
  sm: { fontSize: 14 },
  base: { fontSize: 16 },
  lg: { fontSize: 18 },
  xl: { fontSize: 20 },
  '2xl': { fontSize: 24 },
  '3xl': { fontSize: 30 },
  '4xl': { fontSize: 36 },
  'heading-01': { fontSize: 12, lineHeight: 16 },
  'heading-02': { fontSize: 14, lineHeight: 18 },
  'heading-03': { fontSize: 16, lineHeight: 22 },
  'heading-04': { fontSize: 20, lineHeight: 25 },
  'heading-05': { fontSize: 24, lineHeight: 32 },
  normal: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
})

export { TextComponent as Text }