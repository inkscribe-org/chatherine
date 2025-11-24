import { View, ActivityIndicator, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'large', 
  color = '#0F62FE', 
  className,
  text 
}: LoadingSpinnerProps) {
  return (
    <View className={cn('flex-1 items-center justify-center p-4', className)}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className='text-muted-foreground mt-2 text-center'>
          {text}
        </Text>
      )}
    </View>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center p-4', className)}>
      <Text className='text-destructive text-center mb-4'>
        {message}
      </Text>
      {onRetry && (
        <Button onPress={onRetry} variant='outline'>
          <Text>Retry</Text>
        </Button>
      )}
    </View>
  );
}

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
  className?: string;
}

export function EmptyState({ message, icon, action, className }: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center p-4', className)}>
      {icon && <View className='mb-4'>{icon}</View>}
      <Text className='text-muted-foreground text-center mb-4'>
        {message}
      </Text>
      {action && (
        <Button onPress={action.onPress}>
          <Text>{action.label}</Text>
        </Button>
      )}
    </View>
  );
}