import { Stack } from 'expo-router';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { DollarSign, Clock, Plus, Edit, Copy, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api, BusinessService } from '@/lib/api';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui/loading-states';

// Mock customer ID - in real app this would come from authentication
const MOCK_CUSTOMER_ID = 1;

export default function ServicesScreen() {
  const [services, setServices] = useState<BusinessService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<BusinessService | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedServices = await api.businessServices.getAll(MOCK_CUSTOMER_ID);
      setServices(fetchedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setError('Failed to load services. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: BusinessService) => {
    setEditingService(service);
    // In a real app, this would open a modal or navigate to edit screen
    Alert.alert(
      'Edit Service',
      `Editing: ${service.name}\n\nThis would open an edit form in a real implementation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update Price', 
          onPress: () => updateServicePrice(service) 
        }
      ]
    );
  };

  const updateServicePrice = async (service: BusinessService) => {
    Alert.prompt(
      'Update Price',
      `Enter new price for ${service.name}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async (text) => {
            if (!text) return;
            
            const newPrice = parseFloat(text);
            if (isNaN(newPrice)) {
              Alert.alert('Error', 'Please enter a valid price');
              return;
            }

            try {
              await api.businessServices.update(service.id!, { ...service, price: newPrice });
              await fetchServices(); // Refresh the list
              Alert.alert('Success', `Updated ${service.name} price to $${newPrice}`);
            } catch (error) {
              console.error('Failed to update service:', error);
              Alert.alert('Error', 'Failed to update service price');
            }
          }
        }
      ],
      'plain-text',
      service.price?.toString()
    );
  };

  const handleDeleteService = (service: BusinessService) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.businessServices.delete(service.id!);
              await fetchServices(); // Refresh the list
              Alert.alert('Success', `Deleted ${service.name}`);
            } catch (error) {
              console.error('Failed to delete service:', error);
              Alert.alert('Error', 'Failed to delete service');
            }
          }
        }
      ]
    );
  };

  const handleAddService = () => {
    Alert.prompt(
      'Add New Service',
      'Enter service name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: async (name) => {
            if (!name) return;

            Alert.prompt(
              'Service Category',
              'Enter category (e.g., food, service, tutoring):',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Next',
                  onPress: async (category) => {
                    if (!category) return;

                    Alert.prompt(
                      'Service Price',
                      'Enter price:',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Create',
                          onPress: async (priceText) => {
                            if (!priceText) return;

                            const price = parseFloat(priceText);
                            if (isNaN(price)) {
                              Alert.alert('Error', 'Please enter a valid price');
                              return;
                            }

                            try {
                              await api.businessServices.create({
                                customer_id: MOCK_CUSTOMER_ID,
                                name,
                                category,
                                price,
                                is_available: true,
                              });
                              await fetchServices(); // Refresh the list
                              Alert.alert('Success', `Added ${name} for $${price}`);
                            } catch (error) {
                              console.error('Failed to create service:', error);
                              Alert.alert('Error', 'Failed to create service');
                            }
                          }
                        }
                      ],
                      'plain-text',
                      '0'
                    );
                  }
                }
              ],
              'plain-text',
              'service'
            );
          }
        }
      ],
      'plain-text'
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Services / Menu' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-4">
          {loading ? (
            <LoadingSpinner text="Loading services..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchServices} />
          ) : services.length === 0 ? (
            <EmptyState 
              message="No services found. Add your first service to get started."
              action={{
                label: "Add Service",
                onPress: handleAddService
              }}
            />
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
                    <View className="flex-row items-center gap-2 mb-2">
                      <Text variant="muted" className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {service.category}
                      </Text>
                      {service.duration && (
                        <View className="flex-row items-center gap-1">
                          <Clock size={14} color="#6F6F6F" />
                          <Text variant="muted" className="text-sm">
                            {service.duration}
                          </Text>
                        </View>
                      )}
                    </View>
                    {service.description && (
                      <Text variant="muted" className="text-sm mb-3">
                        {service.description}
                      </Text>
                    )}
                    <View className="flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onPress={() => handleEditService(service)}
                      >
                        <Edit size={14} className="mr-1" />
                        <Text>Edit</Text>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onPress={() => handleDeleteService(service)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        <Text>Delete</Text>
                      </Button>
                    </View>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Service Button */}
              <Button className="w-full mt-6" onPress={handleAddService}>
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