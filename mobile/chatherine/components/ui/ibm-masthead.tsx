import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Search, User, Menu } from 'lucide-react-native';

export function IBMMasthead() {
  return (
    <View className="bg-background border-b border-border h-16 flex-row items-center justify-between px-4">
      <View className="flex-row items-center">
        <View className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center mr-2">
          <Text className="text-primary-foreground font-bold text-sm">C</Text>
        </View>
        <Text className="text-xl font-semibold">Chatherine</Text>
      </View>

      <View className="flex-row items-center space-x-2">
        <Button size="icon" variant="ghost">
          <Icon as={Search} className="size-5" />
        </Button>
        <Button size="icon" variant="ghost">
          <Icon as={User} className="size-5" />
        </Button>
        <Button size="icon" variant="ghost">
          <Icon as={Menu} className="size-5" />
        </Button>
      </View>
    </View>
  );
}