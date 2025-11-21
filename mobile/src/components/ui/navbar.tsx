import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

interface NavbarProps {
  children: React.ReactNode
  style?: ViewStyle
}

const Navbar: React.FC<NavbarProps> = ({ children, style }) => {
  return <View style={[styles.navbar, style]}>{children}</View>
}

const NavbarBrand: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => {
  return <View style={[styles.brand, style]}><Text>{children}</Text></View>
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brand: {
    flex: 1,
  },
})

export { Navbar, NavbarBrand }