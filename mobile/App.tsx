import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Button } from './src/components/ui/button'
import { LoginForm } from './src/components/ui/login-form'
import { CenteredForm } from './src/components/ui/centered-form'
import { Navbar, NavbarBrand } from './src/components/ui/navbar'
import { queryClient } from './src/lib/query-client'

const Stack = createStackNavigator()

function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <Navbar>
        <NavbarBrand>WatsonProbe</NavbarBrand>
      </Navbar>
      <View style={styles.hero}>
        <Text style={styles.title}>
          Transform your business with <Text style={styles.highlight}>AI-powered</Text> solutions
        </Text>
        <View style={styles.buttonRow}>
          <Button variant="outline" size="lg" onPress={() => navigation.navigate('Login')}>Sign in</Button>
          <Button onPress={() => navigation.navigate('Form')}>Get started</Button>
        </View>
      </View>
    </ScrollView>
  )
}

function LoginScreen() {
  return (
    <View style={styles.centered}>
      <LoginForm />
    </View>
  )
}

function FormScreen() {
  return <CenteredForm />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Form" component={FormScreen} />
        </Stack.Navigator>
        <Toast />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    color: '#0F62FE',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
})