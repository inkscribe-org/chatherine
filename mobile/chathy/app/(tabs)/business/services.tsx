import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { DollarSign, Clock, Plus, Edit, Copy } from 'lucide-react-native';

const SERVICES = [
  {
    id: '1',
    name: 'Full Facial',
    price: 120,
    duration: '60 min',
    description: 'Complete facial treatment including cleansing, exfoliation, extraction, and mask.',
  },
  {
    id: '2',
    name: 'Express Manicure',
    price: 35,
    duration: '30 min',
    description: 'Quick manicure with nail shaping, cuticle care, and polish.',
  },
  {
    id: '3',
    name: 'Deluxe Pedicure',
    price: 55,
    duration: '45 min',
    description: 'Luxury pedicure with foot soak, exfoliation, massage, and polish.',
  },
  {
    id: '4',
    name: 'Swedish Massage',
    price: 80,
    duration: '60 min',
    description: 'Relaxing full-body massage using Swedish techniques.',
  },
  {
    id: '5',
    name: 'Eyebrow Shaping',
    price: 25,
    duration: '15 min',
    description: 'Professional eyebrow shaping and tinting.',
  },
];

export default function ServicesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Services / Menu' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-4">
          {/* Services List */}
          {SERVICES.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <View className="flex-row justify-between items-start">
                  <CardTitle className="flex-1">{service.name}</CardTitle>
                  <View className="flex-row items-center gap-1">
                    <DollarSign size={16} color="#0F62FE" />
                    <Text className="font-semibold">{service.price}</Text>
                  </View>
                </View>
              </CardHeader>
              <CardContent>
                <View className="flex-row items-center gap-2 mb-2">
                  <Clock size={14} color="#6F6F6F" />
                  <Text variant="muted" className="text-sm">
                    {service.duration}
                  </Text>
                </View>
                <Text variant="muted" className="text-sm">
                  {service.description}
                </Text>
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
        </View>
      </ScrollView>
    </>
  );
}