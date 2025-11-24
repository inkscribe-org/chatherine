import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const inputVariants = cva(
  'flex h-10 w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary disabled:opacity-50',
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

type InputProps = TextInputProps & VariantProps<typeof inputVariants>;

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <TextInput
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };