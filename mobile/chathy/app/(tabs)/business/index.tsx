import { Link, Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Clock, DollarSign, Package, FileText, Settings } from 'lucide-react-native';

const BUSINESS_SECTIONS = [
  {
    id: 'hours',
    title: 'Hours & Schedule',
    description: 'Manage business hours, blackout dates, and staff availability',
    icon: Clock,
    href: '/business/hours',
  },
  {
    id: 'services',
    title: 'Services / Menu',
    description: 'View and edit your services, prices, and descriptions',
    icon: DollarSign,
    href: '/business/services',
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Track stock levels and manage inventory items',
    icon: Package,
    href: '/business/inventory',
  },
  {
    id: 'policies',
    title: 'Policies & Rules',
    description: 'Set cancellation and booking policies',
    icon: FileText,
    href: '/business/policies',
  },
];

export default function BusinessScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Business' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          <Text variant="h2" className="mb-6">Business Data</Text>
          <View className="space-y-4">
            {BUSINESS_SECTIONS.map((section) => (
              <Link key={section.id} href={section.href} asChild>
                <Card className="cursor-pointer">
                  <CardHeader className="pb-3">
                    <View className="flex-row items-center gap-3">
                      <section.icon size={24} color="#0F62FE" />
                      <CardTitle className="flex-1">{section.title}</CardTitle>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <Text variant="muted" className="text-sm">
                      {section.description}
                    </Text>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}