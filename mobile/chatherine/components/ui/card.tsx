import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { View, Text } from 'react-native';

const cardVariants = cva(
  'rounded-lg border border-border bg-card shadow-sm shadow-black/5',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type CardProps = React.ComponentProps<typeof View> & VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return <View className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('p-6 pt-0', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('flex flex-row items-center p-6 pt-0', className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };