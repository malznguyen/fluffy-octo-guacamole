import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border-2 border-neutral-200 bg-white px-4 py-3 text-base",
        "placeholder:text-neutral-400",
        "focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:shadow-lg",
        "focus-visible:outline-none transition-all duration-200 ease-out",
        "disabled:bg-neutral-50 disabled:text-neutral-500 disabled:border-neutral-200 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
