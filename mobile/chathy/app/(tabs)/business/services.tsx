import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { DollarSign, Clock, Plus, Edit, Copy } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api, Service } from '@/lib/api';

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await api.services.getAll();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Services / Menu' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-4">
          {loading ? (
            <Text>Loading services...</Text>
          ) : (
            <>
              {/* Services List */}
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <View className="flex-row justify-between items-start">
                      <CardTitle className="flex-1">{service.name}</CardTitle>
                      <View className="flex-row items-center gap-1">
                        <DollarSign size={16} color="#0F62FE" />
                        <Text className="font-semibold">${service.price}</Text>
                      </View>
                    </View>
                  </CardHeader>
                  <CardContent>
                    {service.duration && (
                      <View className="flex-row items-center gap-2 mb-2">
                        <Clock size={14} color="#6F6F6F" />
                        <Text variant="muted" className="text-sm">
                          {service.duration} min
                        </Text>
                      </View>
                    )}
                    {service.description && (
                      <Text variant="muted" className="text-sm">
                        {service.description}
                      </Text>
                    )}
                    <View className="flex-row gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit size={14} className="mr-1" />
                        <Text>Edit</Text>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Copy size={14} className="mr-1" />
                        <Text>Duplicate</Text>
                      </Button>
                    </View>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Service Button */}
              <Button className="w-full mt-6">
                <Plus size={16} className="mr-2" />
                <Text>Add New Service</Text>
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}