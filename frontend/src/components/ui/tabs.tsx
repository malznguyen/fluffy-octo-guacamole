"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ children, value, onValueChange, defaultValue, className }: { 
  children: React.ReactNode; 
  value?: string; 
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div className={cn("w-full", className)} data-value={currentValue}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value: currentValue,
            onValueChange: handleValueChange,
          })
        }
        return child
      })}
    </div>
  )
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string } & { onValueChange?: (value: string) => void }
>(({ className, value, onValueChange, ...props }, ref) => {
  const parentValue = (props as any)['data-parent-value'] || ''
  const isActive = parentValue === value
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-slate-950 shadow"
          : "hover:bg-slate-100 hover:text-slate-900",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const parentValue = (props as any)['data-parent-value'] || ''
  const isActive = parentValue === value
  
  if (!isActive) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

// Wrapper để truyền value xuống children
const TabsListWrapper = ({ children, value, onValueChange }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }) => (
  <>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === TabsList) {
          return (
            <TabsList {...child.props}>
              {React.Children.map(child.props.children, (trigger) => {
                if (React.isValidElement(trigger)) {
                  return React.cloneElement(trigger as React.ReactElement<any>, {
                    'data-parent-value': value,
                    onValueChange,
                  })
                }
                return trigger
              })}
            </TabsList>
          )
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child as React.ReactElement<any>, {
            'data-parent-value': value,
          })
        }
      }
      return child
    })}
  </>
)

// Override Tabs để sử dụng wrapper
const TabsWithWrapper = ({ children, ...props }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void; defaultValue?: string; className?: string }) => {
  const [internalValue, setInternalValue] = React.useState(props.defaultValue || '')
  const isControlled = props.value !== undefined
  const currentValue = isControlled ? props.value : internalValue

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    props.onValueChange?.(newValue)
  }

  return (
    <div className={cn("w-full", props.className)}>
      <TabsListWrapper value={currentValue} onValueChange={handleValueChange}>
        {children}
      </TabsListWrapper>
    </div>
  )
}

export { TabsWithWrapper as Tabs, TabsList, TabsTrigger, TabsContent }
