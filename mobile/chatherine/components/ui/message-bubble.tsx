import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';
import { Text } from './text';

const messageBubbleVariants = cva(
  'max-w-[80%] p-4 mb-2',
  {
    variants: {
      variant: {
        sent: 'bg-primary self-end',
        received: 'bg-muted self-start',
      },
    },
    defaultVariants: {
      variant: 'sent',
    },
  }
);

const messageTextVariants = cva('', {
  variants: {
    variant: {
      sent: 'text-primary-foreground',
      received: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'sent',
  },
});

type MessageBubbleProps = {
  message: string;
  timestamp?: string;
} & VariantProps<typeof messageBubbleVariants>;

function MessageBubble({ message, timestamp, variant }: MessageBubbleProps) {
  return (
    <View className={cn(messageBubbleVariants({ variant }))}>
      <Text className={cn(messageTextVariants({ variant }))}>
        {message}
      </Text>
      {timestamp && (
        <Text className={cn('text-xs mt-1 opacity-70', messageTextVariants({ variant }))}>
          {timestamp}
        </Text>
      )}
    </View>
  );
}

export { MessageBubble, messageBubbleVariants };