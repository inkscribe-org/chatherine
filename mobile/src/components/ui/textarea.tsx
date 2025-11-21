import React from 'react'
import { TextInput, StyleSheet, ViewStyle } from 'react-native'

interface TextareaProps {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  style?: ViewStyle
  numberOfLines?: number
}

const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChangeText,
  style,
  numberOfLines = 4,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.textarea, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderRadius: 0,
  },
})

export { Textarea }