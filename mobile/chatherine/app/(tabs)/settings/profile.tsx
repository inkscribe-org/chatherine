import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { User, MapPin, Phone, Mail, Globe, Upload, Save } from 'lucide-react-native';

const BUSINESS_PROFILE = {
  name: 'Bella Spa & Wellness',
  type: 'Spa',
  address: '123 Main Street, Downtown',
  phone: '(555) 123-4567',
  email: 'info@bellaspa.com',
  website: 'www.bellaspa.com',
  description: 'A premium spa offering facial treatments, manicures, pedicures, and massage therapy in a relaxing environment.',
};

export default function ProfileScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Business Profile' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Business Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Business Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="items-center py-4">
                <View className="w-20 h-20 bg-primary rounded-lg items-center justify-center mb-4">
                  <Text className="text-primary-foreground font-bold text-2xl">B</Text>
                </View>
                <Button variant="outline">
                  <Upload size={16} className="mr-2" />
                  <Text>Upload New Logo</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View>
                <Text className="font-medium mb-2">Business Name</Text>
                <Input value={BUSINESS_PROFILE.name} />
              </View>

              <View>
                <Text className="font-medium mb-2">Business Type</Text>
                <Input value={BUSINESS_PROFILE.type} />
              </View>

              <View>
                <Text className="font-medium mb-2">Address</Text>
                <Input value={BUSINESS_PROFILE.address} />
              </View>

              <View>
                <Text className="font-medium mb-2">Phone</Text>
                <Input value={BUSINESS_PROFILE.phone} keyboardType="phone-pad" />
              </View>

              <View>
                <Text className="font-medium mb-2">Email</Text>
                <Input value={BUSINESS_PROFILE.email} keyboardType="email-address" />
              </View>

              <View>
                <Text className="font-medium mb-2">Website</Text>
                <Input value={BUSINESS_PROFILE.website} />
              </View>

              <View>
                <Text className="font-medium mb-2">Description</Text>
                <Input
                  value={BUSINESS_PROFILE.description}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button className="w-full">
            <Save size={16} className="mr-2" />
            <Text>Save Changes</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}