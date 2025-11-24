import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api, Log } from '@/lib/api';

// Removed sample ACTION_LOG, now fetched from API

const ANALYTICS = {
  inquiriesPerDay: 12,
  topServices: [
    { name: 'Full Facial', bookings: 8 },
    { name: 'Express Manicure', bookings: 6 },
    { name: 'Pedicure', bookings: 4 },
  ],
  missedBookings: 2,
  accuracy: 95,
  timeSaved: '4 hours/week',
};

export default function LogsScreen() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchedLogs = await api.logs.getAll();
        setLogs(fetchedLogs);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Logs & Insights' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Analytics Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="grid grid-cols-2 gap-4 mb-6">
                <View className="text-center">
                  <Text className="text-2xl font-bold text-primary">{ANALYTICS.inquiriesPerDay}</Text>
                  <Text variant="muted" className="text-sm">Inquiries/Day</Text>
                </View>
                <View className="text-center">
                  <Text className="text-2xl font-bold text-primary">{ANALYTICS.accuracy}%</Text>
                  <Text variant="muted" className="text-sm">Accuracy</Text>
                </View>
                <View className="text-center">
                  <Text className="text-2xl font-bold text-warning">{ANALYTICS.missedBookings}</Text>
                  <Text variant="muted" className="text-sm">Missed Bookings</Text>
                </View>
                <View className="text-center">
                  <Text className="text-2xl font-bold text-success">{ANALYTICS.timeSaved}</Text>
                  <Text variant="muted" className="text-sm">Time Saved</Text>
                </View>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="font-medium mb-2">Top Services This Week</Text>
                  {ANALYTICS.topServices.map((service, index) => (
                    <View key={index} className="flex-row justify-between py-1">
                      <Text variant="muted">{service.name}</Text>
                      <Text className="font-medium">{service.bookings} bookings</Text>
                    </View>
                  ))}
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Action Log */}
          <Card>
            <CardHeader>
              <CardTitle>Action Log</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Text>Loading logs...</Text>
              ) : (
                <View className="space-y-4">
                  {logs.map((log) => (
                    <View key={log.id} className="border-l-2 border-primary pl-4">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text className="font-medium">{log.action}</Text>
                        <Text variant="muted" className="text-sm">{new Date(log.timestamp).toLocaleString()}</Text>
                      </View>
                      <Text variant="muted" className="text-sm mb-2">{log.details}</Text>
                    </View>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}