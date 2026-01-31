import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-0 active:scale-95 rounded-lg",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white shadow-md hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-0.5",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5",
        outline:
          "border-2 border-neutral-200 bg-white shadow-sm hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5",
        secondary:
          "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 hover:shadow-md hover:-translate-y-0.5",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900 transition-colors",
        link: "text-neutral-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 rounded-lg",
        sm: "h-9 px-3 text-xs rounded-lg",
        lg: "h-14 px-10 text-base rounded-lg",
        icon: "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
