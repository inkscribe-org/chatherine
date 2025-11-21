import { Link, Stack } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { User, CreditCard, Users, Shield, Link as LinkIcon, Lock, Bot, BarChart3 } from 'lucide-react-native';

const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    title: 'Business Profile',
    description: 'Update your business information and branding',
    icon: User,
    href: '/settings/profile',
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    description: 'Manage your subscription and payment methods',
    icon: CreditCard,
    href: '/settings/billing',
  },
  {
    id: 'ai',
    title: 'AI Settings',
    description: 'Configure channels and AI behavior',
    icon: Bot,
    href: '/settings/ai',
  },
  {
    id: 'logs',
    title: 'Logs & Insights',
    description: 'View action logs and analytics',
    icon: BarChart3,
    href: '/settings/logs',
  },
  {
    id: 'team',
    title: 'Team Members',
    description: 'Add and manage team member access',
    icon: Users,
    href: '/settings/team',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Configure 2FA and security settings',
    icon: Shield,
    href: '/settings/security',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect external services and APIs',
    icon: LinkIcon,
    href: '/settings/integrations',
  },
  {
    id: 'privacy',
    title: 'Data Privacy',
    description: 'Control data sharing and privacy settings',
    icon: Lock,
    href: '/settings/privacy',
  },
];

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          <Text variant="h2" className="mb-6">Settings & Profile</Text>
          <View className="space-y-4">
            {SETTINGS_SECTIONS.map((section) => (
              <Link key={section.id} href={section.href} asChild>
                <Card className="cursor-pointer">
                  <CardHeader className="pb-3">
                    <View className="flex-row items-center gap-3">
                      <section.icon size={24} color="#0F62FE" />
                      <CardTitle className="flex-1">{section.title}</CardTitle>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <Text variant="muted" className="text-sm">
                      {section.description}
                    </Text>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}