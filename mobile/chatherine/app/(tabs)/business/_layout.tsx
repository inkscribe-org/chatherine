import { Stack } from 'expo-router';

export default function BusinessLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
  );
}