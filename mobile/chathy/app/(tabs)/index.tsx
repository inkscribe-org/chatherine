import { Stack } from 'expo-router';
import { View } from 'react-native';
import { IBMMasthead } from '@/components/ui/ibm-masthead';
import { Text } from '@/components/ui/text';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 bg-background pt-4">
        <IBMMasthead />
        <View className="flex-1 justify-center items-center p-4">
          <Text variant="h1" className="mb-8">Welcome to Chathy</Text>
          <Text variant="p" className="text-center">
            Switch to the Chat tab to start chatting!
          </Text>
        </View>
      </View>
    </>
  );
}
