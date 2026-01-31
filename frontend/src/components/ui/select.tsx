"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Store label map in a ref to share between components
const labelMapRef: { current: Map<string, string> } = { current: new Map() }

interface SelectContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  registerLabel: (value: string, label: string) => void;
  getLabel: (value: string) => string | undefined;
}

const SelectContext = React.createContext<SelectContextType>({ 
  isOpen: false, 
  setIsOpen: () => {},
  triggerRef: { current: null },
  registerLabel: () => {},
  getLabel: () => undefined,
})

const useSelect = () => React.useContext(SelectContext)

const Select = ({ 
  children, 
  value, 
  onValueChange 
}: { 
  children: React.ReactNode; 
  value?: string; 
  onValueChange?: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  
  // Clear label map when Select unmounts
  React.useEffect(() => {
    return () => {
      labelMapRef.current.clear()
    }
  }, [])

  const registerLabel = React.useCallback((val: string, label: string) => {
    labelMapRef.current.set(val, label)
  }, [])

  const getLabel = React.useCallback((val: string) => {
    return labelMapRef.current.get(val)
  }, [])

  return (
    <SelectContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      value, 
      onValueChange, 
      triggerRef,
      registerLabel,
      getLabel,
    }}>
      {children}
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, triggerRef } = useSelect()
  
  return (
    <button
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border-2 border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const { value, getLabel } = useSelect()
  const label = value ? getLabel(value) || value : undefined
  
  return (
    <span 
      ref={ref} 
      className={cn("flex-1 truncate text-left", !value && "text-neutral-400", className)} 
      {...props}
    >
      {label || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, triggerRef } = useSelect()
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 })
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  // Calculate position when opened
  React.useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      })
    }
  }, [isOpen])
  
  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        contentRef.current && 
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen, triggerRef])
  
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, setIsOpen])
  
  if (!isOpen || typeof document === 'undefined') return null
  
  const content = (
    <div
      ref={(node) => {
        contentRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 9999,
      }}
      className={cn(
        "overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-lg",
        className
      )}
      {...props}
    >
      <div className="p-1 max-h-[300px] overflow-auto">{children}</div>
    </div>
  )
  
  return createPortal(content, document.body)
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange, setIsOpen, registerLabel } = useSelect()
  const isSelected = selectedValue === value
  
  // Register label for this value
  React.useEffect(() => {
    // Try to extract text content from children
    let label = value
    if (typeof children === 'string') {
      label = children
    } else if (React.isValidElement(children)) {
      // If children is a span with flex/items-center, try to get text from deeper
      interface ReactElementProps {
        children?: string | React.ReactNode | Array<string | React.ReactNode>;
      }
      const childProps = children.props as ReactElementProps;
      if (childProps?.children) {
        if (typeof childProps.children === 'string') {
          label = childProps.children
        } else if (Array.isArray(childProps.children)) {
          // Find string child using type predicate
          const textChild = childProps.children.find((c): c is string => typeof c === 'string');
          if (textChild) label = textChild
        }
      }
    }
    registerLabel(value, label)
  }, [value, children, registerLabel])
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none hover:bg-neutral-100 focus:bg-neutral-100",
        isSelected && "bg-neutral-100",
        className
      )}
      onClick={() => {
        onValueChange?.(value)
        setIsOpen(false)
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
