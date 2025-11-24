import { Stack } from 'expo-router';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Clock, Calendar, User, Edit, X, Plus, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api, BusinessHours } from '@/lib/api';
import { LoadingSpinner, ErrorState } from '@/components/ui/loading-states';

// Mock customer ID - in real app this would come from authentication
const MOCK_CUSTOMER_ID = 1;

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function HoursScreen() {
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessHours();
  }, []);

  const fetchBusinessHours = async () => {
    try {
      setLoading(true);
      setError(null);
      const hours = await api.businessHours.getAll(MOCK_CUSTOMER_ID);
      setBusinessHours(hours);
    } catch (error) {
      console.error('Failed to fetch business hours:', error);
      setError('Failed to load business hours. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditHours = (dayIndex: number) => {
    const currentHours = businessHours.find(h => h.day_of_week === dayIndex);
    
    if (currentHours?.is_closed) {
      // Currently closed, ask if they want to open
      Alert.alert(
        'Open Day',
        `${DAYS_OF_WEEK[dayIndex]} is currently closed. Do you want to open it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open',
            onPress: () => updateDayHours(dayIndex, false, '09:00', '17:00')
          }
        ]
      );
    } else {
      // Currently open, show options
      Alert.alert(
        'Edit Hours',
        `${DAYS_OF_WEEK[dayIndex]}: ${currentHours?.open_time} - ${currentHours?.close_time}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Change Hours',
            onPress: () => promptNewHours(dayIndex)
          },
          {
            text: 'Close Day',
            style: 'destructive',
            onPress: () => updateDayHours(dayIndex, true, '', '')
          }
        ]
      );
    }
  };

  const promptNewHours = (dayIndex: number) => {
    Alert.prompt(
      'Opening Time',
      `Enter opening time for ${DAYS_OF_WEEK[dayIndex]} (HH:MM):`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (openTime) => {
            if (!openTime) return;
            
            Alert.prompt(
              'Closing Time',
              `Enter closing time for ${DAYS_OF_WEEK[dayIndex]} (HH:MM):`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Update',
                  onPress: (closeTime) => {
                    if (!closeTime) return;
                    updateDayHours(dayIndex, false, openTime, closeTime);
                  }
                }
              ],
              'plain-text',
              '17:00'
            );
          }
        }
      ],
      'plain-text',
      '09:00'
    );
  };

  const updateDayHours = async (dayIndex: number, isClosed: boolean, openTime: string, closeTime: string) => {
    try {
      const existingHours = businessHours.find(h => h.day_of_week === dayIndex);
      
      if (existingHours) {
        await api.businessHours.update(existingHours.id!, {
          ...existingHours,
          is_closed,
          open_time: isClosed ? '' : openTime,
          close_time: isClosed ? '' : closeTime,
        });
      } else {
        await api.businessHours.create({
          customer_id: MOCK_CUSTOMER_ID,
          day_of_week: dayIndex,
          is_closed,
          open_time: isClosed ? '' : openTime,
          close_time: isClosed ? '' : closeTime,
        });
      }
      
      await fetchBusinessHours(); // Refresh the list
      Alert.alert('Success', `Updated ${DAYS_OF_WEEK[dayIndex]} hours`);
    } catch (error) {
      console.error('Failed to update hours:', error);
      Alert.alert('Error', 'Failed to update business hours');
    }
  };

  const formatHoursDisplay = (hours: BusinessHours[]) => {
    const displayHours = DAYS_OF_WEEK.map((day, index) => {
      const dayHours = hours.find(h => h.day_of_week === index);
      if (dayHours?.is_closed) {
        return { day, hours: 'Closed' };
      } else if (dayHours) {
        return { day, hours: `${dayHours.open_time} - ${dayHours.close_time}` };
      } else {
        return { day, hours: 'Not set' };
      }
    });
    return displayHours;
  };

  const displayHours = formatHoursDisplay(businessHours);

  return (
    <>
      <Stack.Screen options={{ title: 'Hours & Schedule' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {loading ? (
            <LoadingSpinner text="Loading business hours..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchBusinessHours} />
          ) : (
            <>
              {/* Current Hours */}
              <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                {displayHours.map((schedule, index) => (
                  <View key={index} className="flex-row justify-between items-center">
                    <Text className="font-medium">{schedule.day}</Text>
                    <View className="flex-row items-center gap-2">
                      <Text variant="muted">{schedule.hours}</Text>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onPress={() => handleEditHours(index)}
                      >
                        <Edit size={14} />
                      </Button>
                    </View>
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
                <Text variant="muted">• December 25, 2024 - Christmas Day</Text>
                <Text variant="muted">• January 1, 2025 - New Year's Day</Text>
                <Text variant="muted">• March 15, 2025 - Staff Training</Text>
              </View>
              <Button variant="outline" className="w-full mt-3">
                <Plus size={16} className="mr-2" />
                <Text>Add Blackout Date</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Staff Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                <View className="flex-row items-start gap-3">
                  <User size={20} color="#0F62FE" />
                  <View className="flex-1">
                    <Text className="font-medium">Sarah Johnson</Text>
                    <Text variant="muted" className="text-sm">Lead Esthetician</Text>
                    <Text variant="muted" className="text-sm">Mon-Fri 9AM-5PM</Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-3">
                  <User size={20} color="#0F62FE" />
                  <View className="flex-1">
                    <Text className="font-medium">Mike Chen</Text>
                    <Text variant="muted" className="text-sm">Nail Technician</Text>
                    <Text variant="muted" className="text-sm">Tue-Sat 10AM-6PM</Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-3">
                  <User size={20} color="#0F62FE" />
                  <View className="flex-1">
                    <Text className="font-medium">Emma Davis</Text>
                    <Text variant="muted" className="text-sm">Receptionist</Text>
                    <Text variant="muted" className="text-sm">Mon-Sun 8AM-8PM</Text>
                  </View>
                </View>
              </View>
              <Button variant="outline" className="w-full mt-3">
                <Plus size={16} className="mr-2" />
                <Text>Add Staff Member</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <View className="space-y-3">
            <Button variant="outline" className="w-full">
              <Save size={16} className="mr-2" />
              <Text>Save All Changes</Text>
            </Button>
          </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}