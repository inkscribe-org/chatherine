import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Toast from 'react-native-toast-message'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual login API call
      console.log('Login data:', data)
      Toast.show({
        type: 'success',
        text1: 'Login successful!',
      })
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading} style={styles.button}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </View>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
  },
  form: {
    gap: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  error: {
    fontSize: 12,
    color: '#DA1E28',
    marginTop: 4,
  },
  button: {
    width: '100%',
  },
})