import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Package, AlertTriangle } from 'lucide-react-native';

const INVENTORY_ITEMS = [
  {
    id: '1',
    name: 'Facial Cleanser',
    currentStock: 5,
    minStock: 10,
    unit: 'bottles',
    status: 'low',
  },
  {
    id: '2',
    name: 'Moisturizing Cream',
    currentStock: 15,
    minStock: 8,
    unit: 'jars',
    status: 'good',
  },
  {
    id: '3',
    name: 'Nail Polish - Red',
    currentStock: 3,
    minStock: 5,
    unit: 'bottles',
    status: 'low',
  },
  {
    id: '4',
    name: 'Massage Oil',
    currentStock: 12,
    minStock: 6,
    unit: 'bottles',
    status: 'good',
  },
  {
    id: '5',
    name: 'Towels',
    currentStock: 25,
    minStock: 20,
    unit: 'pieces',
    status: 'good',
  },
  {
    id: '6',
    name: 'Gloves',
    currentStock: 2,
    minStock: 10,
    unit: 'boxes',
    status: 'critical',
  },
];

export default function InventoryScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-destructive';
      case 'low':
        return 'text-warning';
      default:
        return 'text-success';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'critical' || status === 'low') {
      return <AlertTriangle size={16} color="#DA1E28" />;
    }
    return null;
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Inventory' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-4">
          {/* Inventory Items */}
          {INVENTORY_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <View className="flex-row justify-between items-start">
                  <CardTitle className="flex-1">{item.name}</CardTitle>
                  <View className="flex-row items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Text className={`font-medium ${getStatusColor(item.status)}`}>
                      {item.currentStock} {item.unit}
                    </Text>
                  </View>
                </View>
              </CardHeader>
              <CardContent>
                <View className="flex-row justify-between">
                  <Text variant="muted" className="text-sm">
                    Minimum: {item.minStock} {item.unit}
                  </Text>
                  <Text variant="muted" className="text-sm">
                    Status: {item.status.toUpperCase()}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text>Total Items</Text>
                  <Text className="font-medium">{INVENTORY_ITEMS.length}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text>Low Stock Items</Text>
                  <Text className="font-medium text-warning">
                    {INVENTORY_ITEMS.filter(item => item.status === 'low').length}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text>Critical Items</Text>
                  <Text className="font-medium text-destructive">
                    {INVENTORY_ITEMS.filter(item => item.status === 'critical').length}
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