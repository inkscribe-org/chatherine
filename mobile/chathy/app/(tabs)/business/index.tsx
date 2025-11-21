import { Link, Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Clock, DollarSign, Package, FileText, Settings, Building, MessageSquare, Info } from 'lucide-react-native';

const BUSINESS_SECTIONS = [
  {
    id: 'info',
    title: 'Business Information',
    description: 'Edit business description, location, and service areas',
    icon: Building,
    href: '/business/info',
    chatCommand: 'Update my business description and location',
  },
  {
    id: 'hours',
    title: 'Hours & Schedule',
    description: 'Manage business hours, blackout dates, and staff availability',
    icon: Clock,
    href: '/business/hours',
    chatCommand: 'Update my business hours',
  },
  {
    id: 'services',
    title: 'Services / Menu',
    description: 'View and edit your services, prices, and descriptions',
    icon: DollarSign,
    href: '/business/services',
    chatCommand: 'I want to update my service prices',
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Track stock levels and manage inventory items',
    icon: Package,
    href: '/business/inventory',
    chatCommand: 'Check my inventory levels',
  },
  {
    id: 'policies',
    title: 'Policies & Rules',
    description: 'Set cancellation and booking policies',
    icon: FileText,
    href: '/business/policies',
    chatCommand: 'Update my business policies',
  },
];

export default function BusinessScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Business' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-4">
          {/* Chat-Based Editing Banner */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <View className="flex-row items-center gap-3">
                <MessageSquare size={24} color="#0F62FE" />
                <CardTitle className="text-blue-900">Chat-Based Editing</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <Text variant="muted" className="text-sm text-blue-800 mb-3">
                You can now edit all your business information through chat! Just type what you want to change, and I'll handle it for you.
              </Text>
              <View className="space-y-2">
                <Text className="text-sm font-medium text-blue-900">Try saying:</Text>
                <Text variant="muted" className="text-sm text-blue-800">• "Update my Monday hours to 9am-6pm"</Text>
                <Text variant="muted" className="text-sm text-blue-800">• "Change my haircut price to $45"</Text>
                <Text variant="muted" className="text-sm text-blue-800">• "Add a new staff member: Sarah as stylist"</Text>
                <Text variant="muted" className="text-sm text-blue-800">• "Update my business address"</Text>
              </View>
            </CardContent>
          </Card>

          <Text variant="h2" className="mb-6">Business Data</Text>
          
          <View className="space-y-4">
            {BUSINESS_SECTIONS.map((section) => (
              <View key={section.id}>
                <Link href={section.href} asChild>
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
                
                {/* Quick Chat Action */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 ml-6"
                  onPress={() => {
                    // Navigate to chat with pre-filled message
                    // This would typically use navigation params
                    console.log('Navigate to chat with:', section.chatCommand);
                  }}
                >
                  <MessageSquare size={14} className="mr-1" />
                  <Text className="text-sm">Edit via Chat</Text>
                </Button>
              </View>
            ))}
          </View>

          {/* Info Card */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <View className="flex-row items-start gap-3">
                <Info size={20} color="#6F6F6F" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900 mb-1">
                    No Dashboard Login Required
                  </Text>
                  <Text variant="muted" className="text-sm text-gray-700">
                    All business management can now be done through chat, eliminating the need to log into a separate web dashboard.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}