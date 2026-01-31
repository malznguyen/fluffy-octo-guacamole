"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: () => { },
  triggerRef: { current: null }
})

const useDropdownMenu = () => React.useContext(DropdownMenuContext)

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement | null>(null)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { isOpen, setIsOpen, triggerRef } = useDropdownMenu()
  const localRef = React.useRef<HTMLElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Store trigger element for positioning
    const target = e.currentTarget as HTMLElement
    triggerRef.current = target
    setIsOpen(!isOpen)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ref: (node: HTMLElement | null) => {
        localRef.current = node
        if (node) triggerRef.current = node
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      ref={localRef as any}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  className?: string;
}

const DropdownMenuContent = ({
  children,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  className
}: DropdownMenuContentProps) => {
  const { isOpen, setIsOpen, triggerRef } = useDropdownMenu()
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Calculate position when opened
  React.useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const contentWidth = 160 // min-w-[10rem] = 160px

      let left = rect.left
      if (align === 'center') {
        left = rect.left + rect.width / 2 - contentWidth / 2
      } else if (align === 'end') {
        left = rect.right - contentWidth
      }

      // Ensure dropdown stays within viewport
      left = Math.max(8, Math.min(left, window.innerWidth - contentWidth - 8))

      const top = side === 'bottom'
        ? rect.bottom + sideOffset
        : rect.top - sideOffset

      setPosition({ top, left })
    }
  }, [isOpen, align, side, sideOffset])

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
      ref={contentRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
      className={cn(
        "min-w-[10rem] overflow-hidden rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-950 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  )

  return createPortal(content, document.body)
}

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, onClick, ...props }, ref) => {
  const { setIsOpen } = useDropdownMenu()

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-neutral-100 focus:bg-neutral-100",
        inset && "pl-8",
        className
      )}
      onClick={(e) => {
        setIsOpen(false)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-100", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
