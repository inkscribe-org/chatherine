import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Clock, Calendar, User, Edit, X, Plus } from 'lucide-react-native';

const CURRENT_HOURS = [
  { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Tuesday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Thursday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Friday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '8:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

const BLACKOUT_DATES = [
  'December 25, 2024 - Christmas Day',
  'January 1, 2025 - New Year\'s Day',
  'March 15, 2025 - Staff Training',
];

const STAFF_AVAILABILITY = [
  { name: 'Sarah Johnson', role: 'Lead Esthetician', availability: 'Mon-Fri 9AM-5PM' },
  { name: 'Mike Chen', role: 'Nail Technician', availability: 'Tue-Sat 10AM-6PM' },
  { name: 'Emma Davis', role: 'Receptionist', availability: 'Mon-Sun 8AM-8PM' },
];

export default function HoursScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hours & Schedule' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Current Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Current Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                {CURRENT_HOURS.map((schedule) => (
                  <View key={schedule.day} className="flex-row justify-between">
                    <Text className="font-medium">{schedule.day}</Text>
                    <Text variant="muted">{schedule.hours}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Blackout Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Blackout Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                {BLACKOUT_DATES.map((date, index) => (
                  <Text key={index} variant="muted">
                    • {date}
                  </Text>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Staff Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                {STAFF_AVAILABILITY.map((staff, index) => (
                  <View key={index} className="flex-row items-start gap-3">
                    <User size={20} color="#0F62FE" />
                    <View className="flex-1">
                      <Text className="font-medium">{staff.name}</Text>
                      <Text variant="muted" className="text-sm">
                        {staff.role}
                      </Text>
                      <Text variant="muted" className="text-sm">
                        {staff.availability}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <View className="space-y-3">
            <Button variant="outline" className="w-full">
              <Edit size={16} className="mr-2" />
              <Text>Change Hours</Text>
            </Button>
            <Button variant="outline" className="w-full">
              <X size={16} className="mr-2" />
              <Text>Close Day</Text>
            </Button>
            <Button variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              <Text>Add Break</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}