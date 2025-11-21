import React from 'react';
import { Stack } from 'expo-router';
import { FlatList, View } from 'react-native';
import { ChatInput } from '@/components/ui/chat-input';
import { MessageBubble } from '@/components/ui/message-bubble';

type Message = {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
};

const SAMPLE_MESSAGES: Message[] = [
  { id: '1', text: 'Hello! How are you?', isSent: false, timestamp: '10:30 AM' },
  { id: '2', text: 'Hi! I\'m doing well, thanks. How about you?', isSent: true, timestamp: '10:31 AM' },
  { id: '3', text: 'Great! Just working on some new features.', isSent: false, timestamp: '10:32 AM' },
  { id: '4', text: 'That sounds interesting. What kind of features?', isSent: true, timestamp: '10:33 AM' },
  { id: '5', text: 'A chat interface using IBM design principles!', isSent: false, timestamp: '10:34 AM' },
];

export default function ChatScreen() {
  const [messages, setMessages] = React.useState<Message[]>(SAMPLE_MESSAGES);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item.text}
      timestamp={item.timestamp}
      variant={item.isSent ? 'sent' : 'received'}
    />
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Chat' }} />
      <View className="flex-1 bg-background">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </View>
    </>
  );
}