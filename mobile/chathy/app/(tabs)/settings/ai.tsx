import { Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Switch } from 'react-native';
import { MessageSquare, Smartphone, Globe, CheckCircle, XCircle, Save } from 'lucide-react-native';

const CHANNELS = [
  {
    id: 'website',
    name: 'Website Widget',
    icon: Globe,
    status: 'active',
    lastInteraction: '2 hours ago',
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: MessageSquare,
    status: 'active',
    lastInteraction: '30 minutes ago',
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    icon: MessageSquare,
    status: 'inactive',
    lastInteraction: 'Never',
  },
  {
    id: 'google',
    name: 'Google Business Messages',
    icon: Smartphone,
    status: 'inactive',
    lastInteraction: 'Never',
  },
];

const AI_BEHAVIOR = {
  tone: 'friendly',
  canBook: true,
  canCancel: true,
  canTakePayments: false,
  canRecommend: true,
};

export default function AISettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'AI Settings' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 space-y-6">
          {/* Channels */}
          <Card>
            <CardHeader>
              <CardTitle>Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-4">
                {CHANNELS.map((channel) => (
                  <View key={channel.id} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <channel.icon size={20} color="#0F62FE" />
                      <View>
                        <Text className="font-medium">{channel.name}</Text>
                        <Text variant="muted" className="text-sm">
                          Last interaction: {channel.lastInteraction}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {channel.status === 'active' ? (
                        <CheckCircle size={16} color="#24A148" />
                      ) : (
                        <XCircle size={16} color="#6F6F6F" />
                      )}
                      <Text className={`text-sm ${channel.status === 'active' ? 'text-success' : 'text-muted-foreground'}`}>
                        {channel.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* AI Behavior Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI Behavior Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View>
                <Text className="font-medium mb-2">Tone</Text>
                <Text variant="muted" className="text-sm">
                  Current: {AI_BEHAVIOR.tone}
                </Text>
                <View className="flex-row gap-2 mt-2">
                  {['friendly', 'formal', 'concise', 'detailed'].map((tone) => (
                    <Button
                      key={tone}
                      variant={AI_BEHAVIOR.tone === tone ? 'default' : 'outline'}
                      size="sm"
                    >
                      <Text>{tone}</Text>
                    </Button>
                  ))}
                </View>
              </View>

              <View className="space-y-3">
                <Text className="font-medium">Allowed Actions</Text>

                <View className="flex-row justify-between items-center">
                  <Text>Can book appointments</Text>
                  <Switch value={AI_BEHAVIOR.canBook} />
                </View>

                <View className="flex-row justify-between items-center">
                  <Text>Can cancel appointments</Text>
                  <Switch value={AI_BEHAVIOR.canCancel} />
                </View>

                <View className="flex-row justify-between items-center">
                  <Text>Can take payments</Text>
                  <Switch value={AI_BEHAVIOR.canTakePayments} />
                </View>

                <View className="flex-row justify-between items-center">
                  <Text>Can recommend services</Text>
                  <Switch value={AI_BEHAVIOR.canRecommend} />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button className="w-full">
            <Save size={16} className="mr-2" />
            <Text>Save Settings</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}