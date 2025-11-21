import React from 'react'
import './global.css'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar'
import { View, Text, ScrollView } from 'react-native'
import { Button } from './src/components/ui/button'
import { LoginForm } from './src/components/ui/login-form'
import { CenteredForm } from './src/components/ui/centered-form'
import { Navbar, NavbarBrand } from './src/components/ui/navbar'
import { queryClient } from './src/lib/query-client'

const Stack = createStackNavigator()

function HomeScreen({ navigation }: any) {
  return (
    <ScrollView className="flex-1 bg-white">
      <Navbar>
        <NavbarBrand>WatsonProbe</NavbarBrand>
      </Navbar>
      <View className="p-5 items-center">
        <Text className="text-4xl font-bold text-center mb-5">
          Transform your business with <Text className="text-blue-600">AI-powered</Text> solutions
        </Text>
        <View className="flex-row gap-2.5">
          <Button variant="outline" size="lg" onPress={() => navigation.navigate('Login')}>Sign in</Button>
          <Button onPress={() => navigation.navigate('Form')}>Get started</Button>
        </View>
      </View>
    </ScrollView>
  )
}

function LoginScreen() {
  return (
    <View className="flex-1 justify-center items-center p-5">
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