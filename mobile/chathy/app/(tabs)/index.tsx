import { Link, Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { IBMMasthead } from '@/components/ui/ibm-masthead';
import { Clock, Calendar, TrendingUp, AlertTriangle, MessageCircle } from 'lucide-react-native';

const RECENT_UPDATES = [
  {
    id: '1',
    message: 'Updated Friday hours: Closed for private event.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    message: 'Increased Full Facial price to $120.',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    message: 'Added new service: Express Manicure - $35.',
    timestamp: '2 days ago',
  },
];

const BUSINESS_SNAPSHOT = {
  hoursToday: '9:00 AM - 7:00 PM',
  nextAppointments: [
    'John Doe - Full Facial (10:00 AM)',
    'Jane Smith - Express Manicure (11:30 AM)',
    'Bob Johnson - Consultation (2:00 PM)',
    'Alice Brown - Pedicure (3:30 PM)',
    'Charlie Wilson - Massage (5:00 PM)',
  ],
  topServices: [
    'Full Facial - 12 bookings this week',
    'Express Manicure - 8 bookings this week',
    'Pedicure - 6 bookings this week',
  ],
  alerts: [
    'Low stock: Facial cleanser',
    'Conflicting booking: 2:00 PM slot',
  ],
};

export default function DashboardScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Dashboard' }} />
      <ScrollView className="flex-1 bg-background">
        <IBMMasthead />
        <View className="p-8 space-y-10">
          {/* Recent Updates Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <View className="space-y-6">
                {RECENT_UPDATES.map((update) => (
                  <View key={update.id} className="flex-row items-start gap-3">
                    <View className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <View className="flex-1">
                      <Text className="text-sm">{update.message}</Text>
                      <Text variant="muted" className="text-xs mt-1">
                        {update.timestamp}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Business Snapshot */}
          <View className="space-y-8">
            <Text className="text-xl font-semibold">Business Snapshot</Text>

            {/* Hours Today */}
            <Card>
              <CardContent className="p-6">
                <View className="flex-row items-center gap-3">
                  <Clock size={24} color="#0F62FE" />
                  <View>
                    <Text className="font-medium text-base">Hours Today</Text>
                    <Text variant="muted" className="text-sm">{BUSINESS_SNAPSHOT.hoursToday}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Next Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex-row items-center gap-2">
                  <Calendar size={20} color="#0F62FE" />
                  Next 5 Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <View className="space-y-3">
                  {BUSINESS_SNAPSHOT.nextAppointments.map((appointment, index) => (
                    <Text key={index} variant="muted" className="text-sm">
                      • {appointment}
                    </Text>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex-row items-center gap-2">
                  <TrendingUp size={20} color="#0F62FE" />
                  Top Services This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <View className="space-y-3">
                  {BUSINESS_SNAPSHOT.topServices.map((service, index) => (
                    <Text key={index} variant="muted" className="text-sm">
                      • {service}
                    </Text>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* Alerts */}
            {BUSINESS_SNAPSHOT.alerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex-row items-center gap-2">
                    <AlertTriangle size={20} color="#DA1E28" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <View className="space-y-3">
                    {BUSINESS_SNAPSHOT.alerts.map((alert, index) => (
                      <Text key={index} variant="muted" className="text-sm text-destructive">
                        • {alert}
                      </Text>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}
          </View>

          {/* Text Chathy Button */}
          <Link href="/chat" asChild>
            <Button size="lg" className="w-full">
              <MessageCircle size={20} className="mr-2" />
              <Text>Text Chathy</Text>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </>
  );
}
