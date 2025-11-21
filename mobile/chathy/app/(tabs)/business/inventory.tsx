import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Package, AlertTriangle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api, InventoryItem } from '@/lib/api';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const fetchedInventory = await api.inventory.getAll();
        setInventory(fetchedInventory);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const getStatus = (quantity: number) => {
    if (quantity <= 2) return 'critical';
    if (quantity <= 5) return 'low';
    return 'good';
  };

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
          {loading ? (
            <Text>Loading inventory...</Text>
          ) : (
            <>
              {/* Inventory Items */}
              {inventory.map((item) => {
                const status = getStatus(item.quantity);
                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <View className="flex-row justify-between items-start">
                        <CardTitle className="flex-1">{item.name}</CardTitle>
                        <View className="flex-row items-center gap-2">
                          {getStatusIcon(status)}
                          <Text className={`font-medium ${getStatusColor(status)}`}>
                            {item.quantity} units
                          </Text>
                        </View>
                      </View>
                    </CardHeader>
                    <CardContent>
                      <View className="flex-row justify-between">
                        <Text variant="muted" className="text-sm">
                          Price: ${item.price}
                        </Text>
                        <Text variant="muted" className="text-sm">
                          Status: {status.toUpperCase()}
                        </Text>
                      </View>
                      {item.category && (
                        <Text variant="muted" className="text-sm">
                          Category: {item.category}
                        </Text>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text>Total Items</Text>
                      <Text className="font-medium">{inventory.length}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text>Low Stock Items</Text>
                      <Text className="font-medium text-warning">
                        {inventory.filter(item => getStatus(item.quantity) === 'low').length}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text>Critical Items</Text>
                      <Text className="font-medium text-destructive">
                        {inventory.filter(item => getStatus(item.quantity) === 'critical').length}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}