import React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'field' | 'primary-ghost' | 'secondary-ghost' | 'danger-ghost'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'
  onPress?: () => void
  disabled?: boolean
  children: React.ReactNode
  style?: ViewStyle
}

const buttonVariants = {
  variant: {
    default: { backgroundColor: '#0F62FE', borderColor: '#0F62FE' },
    destructive: { backgroundColor: '#DA1E28', borderColor: '#DA1E28' },
    outline: { backgroundColor: 'transparent', borderColor: '#E0E0E0', borderWidth: 1 },
    secondary: { backgroundColor: '#393939', borderColor: '#393939' },
    ghost: { backgroundColor: 'transparent' },
    link: { backgroundColor: 'transparent' },
    field: { backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 2 },
    'primary-ghost': { backgroundColor: 'transparent' },
    'secondary-ghost': { backgroundColor: 'transparent' },
    'danger-ghost': { backgroundColor: 'transparent' },
  },
  size: {
    default: { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
    sm: { height: 36, paddingHorizontal: 12, paddingVertical: 6 },
    lg: { height: 48, paddingHorizontal: 24, paddingVertical: 12 },
    xl: { height: 56, paddingHorizontal: 32, paddingVertical: 16 },
    icon: { width: 40, height: 40 },
    'icon-sm': { width: 32, height: 32 },
    'icon-lg': { width: 48, height: 48 },
  },
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  onPress,
  disabled = false,
  children,
  style,
}) => {
  const variantStyle = buttonVariants.variant[variant]
  const sizeStyle = buttonVariants.size[size]

  return (
    <Pressable
      style={[styles.button, variantStyle, sizeStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, variant === 'default' && styles.textDefault]}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textDefault: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
})

export { Button }