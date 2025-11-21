import React from 'react'
import { TextInput, StyleSheet, ViewStyle } from 'react-native'

interface InputProps {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  secureTextEntry?: boolean
  style?: ViewStyle
  // Add other props as needed
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderRadius: 0,
  },
})

export { Input }