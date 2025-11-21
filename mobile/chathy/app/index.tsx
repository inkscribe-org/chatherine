import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { IBMMasthead } from '@/components/ui/ibm-masthead';
import { Text } from '@/components/ui/text';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 bg-background">
        <IBMMasthead />
        <View className="flex-1 justify-center items-center p-4">
          <Text variant="h1" className="mb-8">Welcome to Chathy</Text>
          <Link href="/chat" asChild>
            <Button size="lg">
              <Text>Open Chat</Text>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}
