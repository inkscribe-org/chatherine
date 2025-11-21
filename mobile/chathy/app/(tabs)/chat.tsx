import React from 'react';
import { FlatList, View, Alert } from 'react-native';
import { ChatInput } from '@/components/ui/chat-input';
import { MessageBubble } from '@/components/ui/message-bubble';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import { api } from '@/lib/api';

type Message = {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
  chathyResponse?: {
    understood: string;
    applied: string;
    actions?: string[];
    success?: boolean;
    error?: string;
  };
};

export default function ChatScreen() {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      const data = await api.chat.sendMessage(text);
      const chathyReply: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isSent: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, chathyReply]);
    } catch (error) {
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I couldn\'t process your request. Please try again.',
        isSent: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chathyResponse: {
          understood: 'Failed to process request',
          applied: 'No action taken',
          error: error.message,
          success: false,
        },
      };
      setMessages(prev => [...prev, errorReply]);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className="mb-6">
      <MessageBubble
        message={item.text}
        timestamp={item.timestamp}
        variant={item.isSent ? 'sent' : 'received'}
      />
      {item.chathyResponse && item.isSent && (
        <Card className="mt-4 mx-6">
          <CardContent className="p-6">
            <View className="flex-row items-center gap-2 mb-3">
              {item.chathyResponse.success === false ? (
                <AlertCircle size={20} color="#EF4444" />
              ) : (
                <CheckCircle size={20} color="#10B981" />
              )}
              <Text className="text-sm font-medium">
                {item.chathyResponse.success === false ? 'Action Failed' : 'Action Completed'}
              </Text>
            </View>
            
            <Text className="text-sm font-medium mb-3">What I understood:</Text>
            <Text variant="muted" className="text-sm mb-4">
              {item.chathyResponse.understood}
            </Text>
            
            <Text className="text-sm font-medium mb-3">What I applied:</Text>
            <Text variant="muted" className="text-sm mb-4">
              {item.chathyResponse.applied}
            </Text>
            
            {item.chathyResponse.error && (
              <>
                <Text className="text-sm font-medium mb-3 text-red-600">Error:</Text>
                <Text variant="muted" className="text-sm mb-4 text-red-600">
                  {item.chathyResponse.error}
                </Text>
              </>
            )}
            
            {item.chathyResponse.actions && (
              <>
                <Text className="text-sm font-medium mb-3">Actions triggered:</Text>
                {item.chathyResponse.actions.map((action, index) => (
                  <Text key={index} variant="muted" className="text-sm mb-2">
                    • {action}
                  </Text>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onClearChat={handleClearChat}
        placeholder="Ask me to update your business hours, prices, location, staff, or availability..."
      />
    </View>
  );
}
