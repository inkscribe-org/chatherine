import {useState} from 'react';
import { cn } from '@/lib/utils';
import { Send, Trash2, Clock, DollarSign, MapPin, Users, Calendar } from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { Button } from './button';
import { Input } from './input';
import { Text } from './text';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onClearChat?: () => void;
  placeholder?: string;
  className?: string;
};

const QUICK_ACTIONS = [
  { icon: Clock, label: 'Update Hours', command: 'Update my business hours' },
  { icon: DollarSign, label: 'Change Prices', command: 'I want to update my service prices' },
  { icon: MapPin, label: 'Edit Location', command: 'Update my business address and service areas' },
  { icon: Users, label: 'Manage Staff', command: 'Add or update staff members' },
  { icon: Calendar, label: 'Set Availability', command: 'Update appointment availability' },
];

function ChatInput({ onSendMessage, onClearChat, placeholder = 'Type a message...', className }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setShowQuickActions(false);
    }
  };

  const handleClear = () => {
    onClearChat?.();
  };

  const handleQuickAction = (command: string) => {
    setMessage(command);
    setShowQuickActions(false);
  };

  return (
    <View className={cn('bg-background', className)}>
      {showQuickActions && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2 border-b border-border">
          <View className="flex-row gap-2">
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onPress={() => handleQuickAction(action.command)}
                  className="flex-row items-center gap-2 px-3"
                >
                  <Icon size={16} />
                  <Text className="text-sm">{action.label}</Text>
                </Button>
              );
            })}
          </View>
        </ScrollView>
      )}
      
      <View className="flex-row items-center gap-3 p-6 border-t border-border">
        {onClearChat && (
          <Button
            size="icon"
            variant="outline"
            onPress={handleClear}
          >
            <Trash2 size={20} />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="outline"
          onPress={() => setShowQuickActions(!showQuickActions)}
        >
          <Clock size={20} />
        </Button>
        
        <Input
          className="flex-1"
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Button
          size="icon"
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </Button>
      </View>
    </View>
  );
}

export { ChatInput };
