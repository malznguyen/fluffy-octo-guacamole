import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Label } from "./label"
import { LucideIcon } from "lucide-react"

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  wrapperClassName?: string
  icon?: LucideIcon
  iconClassName?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, wrapperClassName, icon: Icon, iconClassName, id, ...props }, ref) => {
    const inputId = id || React.useId()
    const hasIcon = !!Icon
    
    return (
      <div className={cn("relative group", wrapperClassName)}>
        {/* Icon - positioned at left */}
        {Icon && (
          <Icon
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none z-10 transition-colors duration-200",
              "text-neutral-400 group-focus-within:text-rose-500",
              iconClassName
            )}
          />
        )}
        
        <Input
          id={inputId}
          className={cn(
            "h-14 pt-4 peer placeholder-transparent",
            // Add left padding when icon is present
            hasIcon && "pl-12",
            // Add right padding for password toggle if needed
            props.type === "password" && "pr-12",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          placeholder=" "
          ref={ref}
          {...props}
        />
        <Label
          htmlFor={inputId}
          className={cn(
            "absolute pointer-events-none origin-left",
            "text-neutral-500",
            // Label position: if has icon, start at left-12, else left-4
            hasIcon ? "left-12" : "left-4",
            // Default state (placeholder shown) - centered vertically
            "top-1/2 -translate-y-1/2 text-base",
            // Focus state - move up, shrink, change color
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-rose-600 peer-focus:font-medium",
            // Filled state (has value) - move up, shrink
            "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-neutral-700",
            // Error state
            error && "peer-not-placeholder-shown:text-red-600",
            "transition-all duration-200 ease-out"
          )}
        >
          {label}
        </Label>
        
        {error && (
          <p className="mt-1.5 text-sm text-red-600 ml-1">{error}</p>
        )}
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
