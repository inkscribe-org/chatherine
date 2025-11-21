import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva("font-sans", {
  variants: {
    variant: {
      default: "",
      inherit: "",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      error: "text-destructive",
      success: "text-green-60",
      warning: "text-yellow-60", 
      info: "text-blue-60",
    },
    size: {
      default: "text-sm",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "heading-01": "text-xs leading-[1.33]",
      "heading-02": "text-sm leading-[1.29]",
      "heading-03": "text-base leading-[1.375]",
      "heading-04": "text-xl leading-[1.25]",
      "heading-05": "text-2xl leading-[1.33]",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "inherit",
    size: "default",
    weight: "normal",
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, variant, size, weight, ...props }, ref) => {
    return (
      <span
        className={cn(textVariants({ variant, size, weight, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

// eslint-disable-next-line react-refresh/only-export-components
export { Text, textVariants }
