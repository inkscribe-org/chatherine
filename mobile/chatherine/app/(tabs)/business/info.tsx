import { Stack } from 'expo-router';
import { View, ScrollView, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { MapPin, Building, Edit, Save, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api, BusinessFact, Customer } from '@/lib/api';

// Mock customer ID - in real app this would come from authentication
const MOCK_CUSTOMER_ID = 1;

export default function BusinessInfoScreen() {
  const [businessFacts, setBusinessFacts] = useState<BusinessFact[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facts, customerData] = await Promise.all([
        api.businessFacts.getAll(MOCK_CUSTOMER_ID),
        api.customers.getAll().then(customers => customers.find(c => c.id === MOCK_CUSTOMER_ID))
      ]);
      
      setBusinessFacts(facts);
      setCustomer(customerData || null);
    } catch (error) {
      console.error('Failed to fetch business info:', error);
      Alert.alert('Error', 'Failed to load business information');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBusinessDescription = () => {
    if (!customer) return;

    Alert.prompt(
      'Business Description',
      'Enter your business description:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async (description) => {
            if (!description) return;

            try {
              await api.customers.update(customer.id!, {
                ...customer,
                business_name: customer.business_name || '',
                business_type: description,
              });
              await fetchData(); // Refresh the data
              Alert.alert('Success', 'Business description updated');
            } catch (error) {
              console.error('Failed to update business description:', error);
              Alert.alert('Error', 'Failed to update business description');
            }
          }
        }
      ],
      'plain-text',
      customer.business_type || ''
    );
  };

  const handleEditLocation = () => {
    if (!customer) return;

    Alert.prompt(
      'Business Address',
      'Enter your business address:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async (address) => {
            if (!address) return;

            try {
              await api.customers.update(customer.id!, {
                ...customer,
                business_address: address,
              });
              await fetchData(); // Refresh the data
              Alert.alert('Success', 'Business address updated');
            } catch (error) {
              console.error('Failed to update business address:', error);
              Alert.alert('Error', 'Failed to update business address');
            }
          }
        }
      ],
      'plain-text',
      customer.business_address || ''
    );
  };

  const handleAddBusinessFact = () => {
    Alert.prompt(
      'Add Business Information',
      'Enter a title for this information:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (title) => {
            if (!title) return;

            Alert.prompt(
              'Content',
              'Enter the detailed information:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Next',
                  onPress: (content) => {
                    if (!content) return;

                    Alert.prompt(
                      'Category',
                      'Enter a category (e.g., general, services, location):',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Create',
                          onPress: async (category) => {
                            if (!category) return;

                            try {
                              await api.businessFacts.create({
                                customer_id: MOCK_CUSTOMER_ID,
                                title,
                                content,
                                category,
                                is_public: true,
                              });
                              await fetchData(); // Refresh the data
                              Alert.alert('Success', 'Business information added');
                            } catch (error) {
                              console.error('Failed to add business fact:', error);
                              Alert.alert('Error', 'Failed to add business information');
                            }
                          }
                        }
                      ],
                      'plain-text',
                      'general'
                    );
                  }
                }
              ],
              'plain-text'
            );
          }
        }
      ],
      'plain-text'
    );
  };

  const handleEditFact = (fact: BusinessFact) => {
    Alert.alert(
      'Edit Information',
      fact.title,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit Content',
          onPress: () => {
            Alert.prompt(
              'Edit Content',
              'Update the information:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Update',
                  onPress: async (newContent) => {
                    if (!newContent) return;

                    try {
                      await api.businessFacts.update(fact.id!, {
                        ...fact,
                        content: newContent,
                      });
                      await fetchData(); // Refresh the data
                      Alert.alert('Success', 'Information updated');
                    } catch (error) {
                      console.error('Failed to update business fact:', error);
                      Alert.alert('Error', 'Failed to update information');
                    }
                  }
                }
              ],
              'plain-text',
              fact.content
            );
          }
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.businessFacts.delete(fact.id!);
              await fetchData(); // Refresh the data
              Alert.alert('Success', 'Information deleted');
            } catch (error) {
              console.error('Failed to delete business fact:', error);
              Alert.alert('Error', 'Failed to delete information');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text>Loading business information...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Business Information' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Business Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Business Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View className="flex-row items-center gap-2">
                <Building size={20} color="#0F62FE" />
                <View className="flex-1">
                  <Text className="font-medium">Business Name</Text>
                  <Text variant="muted">{customer?.business_name || 'Not set'}</Text>
                </View>
                <Button variant="ghost" size="sm" onPress={handleEditBusinessDescription}>
                  <Edit size={16} />
                </Button>
              </View>
              
              <View className="flex-row items-center gap-2">
                <MapPin size={20} color="#0F62FE" />
                <View className="flex-1">
                  <Text className="font-medium">Location</Text>
                  <Text variant="muted">{customer?.business_address || 'Not set'}</Text>
                </View>
                <Button variant="ghost" size="sm" onPress={handleEditLocation}>
                  <Edit size={16} />
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Business Facts */}
          <Card>
            <CardHeader>
              <View className="flex-row justify-between items-center">
                <CardTitle>Business Details</CardTitle>
                <Button variant="ghost" size="sm" onPress={handleAddBusinessFact}>
                  <Plus size={16} />
                </Button>
              </View>
            </CardHeader>
            <CardContent>
              {businessFacts.length > 0 ? (
                <View className="space-y-3">
                  {businessFacts.map((fact) => (
                    <View key={fact.id} className="border-l-4 border-blue-500 pl-3">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="font-medium">{fact.title}</Text>
                          <Text variant="muted" className="text-sm mt-1">
                            {fact.content}
                          </Text>
                          <Text variant="muted" className="text-xs mt-1 bg-gray-100 px-2 py-1 rounded self-start">
                            {fact.category}
                          </Text>
                        </View>
                        <Button variant="ghost" size="sm" onPress={() => handleEditFact(fact)}>
                          <Edit size={14} />
                        </Button>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text variant="muted">No business details added yet.</Text>
              )}
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                <Text variant="muted">• Downtown District</Text>
                <Text variant="muted">• Metropolitan Area</Text>
                <Text variant="muted">• Within 10 miles radius</Text>
              </View>
              <Button variant="outline" className="w-full mt-3">
                <Plus size={16} className="mr-2" />
                <Text>Add Service Area</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <Button className="w-full">
            <Save size={16} className="mr-2" />
            <Text>Save All Changes</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}