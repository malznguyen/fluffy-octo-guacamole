import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-lg border-2 border-neutral-200 bg-white px-4 py-2 text-base",
          "placeholder:text-neutral-400",
          "focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:shadow-lg focus:shadow-rose-500/5",
          "focus-visible:outline-none transition-all duration-200 ease-out",
          "disabled:bg-neutral-50 disabled:text-neutral-500 disabled:border-neutral-200 disabled:cursor-not-allowed",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
