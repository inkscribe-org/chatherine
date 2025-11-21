import React from 'react';
import { FlatList, View } from 'react-native';
import { ChatInput } from '@/components/ui/chat-input';
import { MessageBubble } from '@/components/ui/message-bubble';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

type Message = {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
  chathyResponse?: {
    understood: string;
    applied: string;
    actions?: string[];
  };
};

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Increase full facial from $100 to $120.',
    isSent: true,
    timestamp: '10:30 AM',
    chathyResponse: {
      understood: 'Update service price',
      applied: 'Full Facial price changed to $120',
      actions: ['Updated pricing in system', 'Notified team members'],
    },
  },
  {
    id: '2',
    text: 'Got it! Updated the service "Full Facial" to $120.',
    isSent: false,
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    text: 'Close tomorrow for staff training.',
    isSent: true,
    timestamp: '2:15 PM',
    chathyResponse: {
      understood: 'Schedule closure',
      applied: 'Business closed tomorrow for staff training',
      actions: ['Updated calendar', 'Sent notifications to customers with appointments'],
    },
  },
  {
    id: '4',
    text: 'Understood! I\'ve closed the business tomorrow and notified affected customers.',
    isSent: false,
    timestamp: '2:16 PM',
  },
  {
    id: '5',
    text: 'Add new service: Express Manicure $35.',
    isSent: true,
    timestamp: '4:20 PM',
    chathyResponse: {
      understood: 'Add new service',
      applied: 'Added "Express Manicure" for $35',
      actions: ['Created service in menu', 'Updated online booking'],
    },
  },
  {
    id: '6',
    text: 'Done! "Express Manicure" has been added to your services at $35.',
    isSent: false,
    timestamp: '4:21 PM',
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = React.useState<Message[]>(SAMPLE_MESSAGES);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // Mock Chathy response
      chathyResponse: {
        understood: 'Processing your request...',
        applied: 'Update applied successfully',
        actions: ['Synced with calendar', 'Updated customer notifications'],
      },
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate Chathy response after a delay
    setTimeout(() => {
      const chathyReply: Message = {
        id: (Date.now() + 1).toString(),
        text: `Got it! ${newMessage.chathyResponse?.applied}`,
        isSent: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, chathyReply]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className="mb-4">
      <MessageBubble
        message={item.text}
        timestamp={item.timestamp}
        variant={item.isSent ? 'sent' : 'received'}
      />
      {item.chathyResponse && item.isSent && (
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <Text className="text-sm font-medium mb-2">What I understood:</Text>
            <Text variant="muted" className="text-sm mb-4">
              {item.chathyResponse.understood}
            </Text>
            <Text className="text-sm font-medium mb-2">What I applied:</Text>
            <Text variant="muted" className="text-sm mb-4">
              {item.chathyResponse.applied}
            </Text>
            {item.chathyResponse.actions && (
              <>
                <Text className="text-sm font-medium mb-2">Actions triggered:</Text>
                {item.chathyResponse.actions.map((action, index) => (
                  <Text key={index} variant="muted" className="text-sm mb-1">
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
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
      <ChatInput onSendMessage={handleSendMessage} />
    </View>
  );
}