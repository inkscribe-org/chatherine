import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CreditCard, Calendar, CheckCircle, Plus } from 'lucide-react-native';

const SUBSCRIPTION_PLAN = {
  name: 'Professional Plan',
  price: '$49/month',
  features: [
    'Unlimited text conversations',
    'Calendar integration',
    'Customer management',
    'Analytics dashboard',
    'Priority support',
  ],
  nextBilling: 'December 15, 2024',
};

const PAYMENT_METHODS = [
  {
    id: '1',
    type: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/26',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Credit Card',
    last4: '8888',
    brand: 'Mastercard',
    expiry: '08/25',
    isDefault: false,
  },
];

const BILLING_HISTORY = [
  {
    id: '1',
    date: 'November 15, 2024',
    amount: '$49.00',
    status: 'Paid',
    description: 'Professional Plan - Monthly',
  },
  {
    id: '2',
    date: 'October 15, 2024',
    amount: '$49.00',
    status: 'Paid',
    description: 'Professional Plan - Monthly',
  },
  {
    id: '3',
    date: 'September 15, 2024',
    amount: '$49.00',
    status: 'Paid',
    description: 'Professional Plan - Monthly',
  },
];

export default function BillingScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Billing & Subscription' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="font-semibold text-lg">{SUBSCRIPTION_PLAN.name}</Text>
                  <Text className="text-primary font-medium">{SUBSCRIPTION_PLAN.price}</Text>
                </View>
                <Button variant="outline" size="sm">
                  <Text>Upgrade</Text>
                </Button>
              </View>

              <View className="space-y-2 mb-4">
                {SUBSCRIPTION_PLAN.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#24A148" />
                    <Text variant="muted" className="text-sm">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row items-center gap-2 pt-2 border-t border-border">
                <Calendar size={16} color="#6F6F6F" />
                <Text variant="muted" className="text-sm">
                  Next billing: {SUBSCRIPTION_PLAN.nextBilling}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <View className="flex-row justify-between items-center">
                <CardTitle>Payment Methods</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus size={14} className="mr-1" />
                  <Text>Add Card</Text>
                </Button>
              </View>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <View key={method.id} className="flex-row items-center justify-between p-3 border border-border rounded-lg">
                    <View className="flex-row items-center gap-3">
                      <CreditCard size={20} color="#0F62FE" />
                      <View>
                        <Text className="font-medium">
                          {method.brand} •••• {method.last4}
                        </Text>
                        <Text variant="muted" className="text-sm">
                          Expires {method.expiry}
                        </Text>
                      </View>
                    </View>
                    {method.isDefault && (
                      <Text className="text-primary text-sm font-medium">Default</Text>
                    )}
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                {BILLING_HISTORY.map((bill) => (
                  <View key={bill.id} className="flex-row justify-between items-center py-2">
                    <View>
                      <Text className="font-medium">{bill.description}</Text>
                      <Text variant="muted" className="text-sm">{bill.date}</Text>
                    </View>
                    <View className="text-right">
                      <Text className="font-medium">{bill.amount}</Text>
                      <Text className="text-success text-sm">{bill.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}