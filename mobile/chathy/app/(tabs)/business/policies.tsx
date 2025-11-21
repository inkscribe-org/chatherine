import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { FileText, Clock, Calendar } from 'lucide-react-native';

const POLICIES = {
  cancellation: {
    title: 'Cancellation Policy',
    description: 'Clients must cancel or reschedule appointments at least 24 hours in advance. Late cancellations or no-shows may be charged 50% of the service price.',
  },
  booking: {
    title: 'Booking Policy',
    description: 'Appointments can be booked up to 3 months in advance. Walk-ins are welcome but appointments are prioritized.',
  },
  late: {
    title: 'Late Arrival Policy',
    description: 'If you arrive more than 15 minutes late, your appointment may be shortened or rescheduled depending on availability.',
  },
};

const CHATHY_RESPONSES = [
  {
    scenario: 'Customer asks to cancel appointment',
    response: 'I understand you need to cancel your appointment. According to our 24-hour policy, I can reschedule this for you. Would you like to book a new time?',
  },
  {
    scenario: 'Customer wants to book last-minute',
    response: 'I\'d be happy to help you book an appointment. We require 24 hours notice for most services. Let me check our availability for tomorrow.',
  },
  {
    scenario: 'Customer is running late',
    response: 'No problem at all! We understand things happen. Please let us know when you expect to arrive, and we\'ll do our best to accommodate you.',
  },
];

export default function PoliciesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Policies & Rules' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Business Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(POLICIES).map(([key, policy]) => (
                <View key={key}>
                  <Text className="font-medium mb-2">{policy.title}</Text>
                  <Text variant="muted" className="text-sm">
                    {policy.description}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Chathy Response Preview */}
          <Card>
            <CardHeader>
              <CardTitle>"How Chathy Responds" Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CHATHY_RESPONSES.map((item, index) => (
                <View key={index} className="border-l-2 border-primary pl-4">
                  <Text className="font-medium mb-1">{item.scenario}</Text>
                  <Text variant="muted" className="text-sm italic">
                    "{item.response}"
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <View className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <Text className="font-medium mb-2">Quick Policy Updates</Text>
                <Text variant="muted" className="text-sm mb-3">
                  Text Chathy to update policies: "Change cancellation to 48 hours" or "Update late policy to 10 minutes"
                </Text>
                <Text className="text-sm">
                  💡 Tip: Policy changes are automatically applied to your booking system and customer communications.
                </Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </>
  );
}