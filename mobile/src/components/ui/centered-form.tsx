import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export function CenteredForm() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={styles.content}>
            <View style={styles.field}>
              <Label>Email</Label>
              <Input placeholder="Email" />
            </View>
            <View style={styles.field}>
              <Label>Password</Label>
              <Input placeholder="Password" secureTextEntry />
            </View>
            <Text variant="primary" size="sm" style={styles.link}>Forgot password?</Text>
            <Button style={styles.button}>Login</Button>
          </View>
        </CardContent>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  card: {
    width: '90%',
    maxWidth: 300,
  },
  content: {
    gap: 16,
  },
  field: {
    marginBottom: 16,
  },
  link: {
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
  },
})