import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

const CardHeader: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>
}

const CardTitle: React.FC<{ children: React.ReactNode; style?: TextStyle }> = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>
}

const CardDescription: React.FC<{ children: React.ReactNode; style?: TextStyle }> = ({ children, style }) => {
  return <Text style={[styles.description, style]}>{children}</Text>
}

const CardContent: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>
}

const CardFooter: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'column',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6F6F6F',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
  },
})

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }