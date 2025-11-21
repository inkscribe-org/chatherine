import {useState} from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react-native';
import { View } from 'react-native';
import { Button } from './button';
import { Input } from './input';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  className?: string;
};

function ChatInput({ onSendMessage, placeholder = 'Type a message...', className }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View className={cn('flex-row items-center gap-3 p-6 border-t border-border bg-background', className)}>
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
  );
}

export { ChatInput };
