import { Tabs } from 'expo-router';
import { Home, MessageCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'hsl(var(--background))',
          borderTopColor: 'hsl(var(--border))',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: 'hsl(var(--primary))',
        tabBarInactiveTintColor: 'hsl(var(--muted-foreground))',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}