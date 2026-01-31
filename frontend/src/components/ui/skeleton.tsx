import { cn } from "@/lib/utils"

/**
 * Enhanced Skeleton component with shimmer animation
 * 
 * Variants:
 * - default: Standard pulse animation with neutral background
 * - shimmer: Wave gradient animation (recommended for cards)
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shimmer"
}

function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-neutral-200",
        variant === "default" && "animate-pulse",
        variant === "shimmer" && "skeleton-shimmer",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card Skeleton - Pre-configured for product/content cards
 */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Image area */}
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Price */}
      <Skeleton className="h-5 w-1/3" />
    </div>
  )
}

/**
 * Product Card Grid Skeleton
 */
function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Text Skeleton - For lines of text
 */
function TextSkeleton({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full"
          )} 
        />
      ))}
    </div>
  )
}

/**
 * Table Row Skeleton
 */
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-5 rounded",
            i === 0 ? "w-12 h-12" : // Image
            i === 1 ? "flex-1" : // Name (wider)
            "w-20" // Other columns
          )} 
        />
      ))}
    </div>
  )
}

/**
 * Table Skeleton
 */
function TableSkeleton({ rows = 8, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </div>
    </div>
  )
}

/**
 * Hero Banner Skeleton
 */
function HeroSkeleton() {
  return (
    <div className="relative h-[600px] md:h-[800px] overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" variant="shimmer" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-16 md:h-24 w-full max-w-2xl" />
        <Skeleton className="h-6 w-full max-w-lg" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-14 w-40 rounded-xl" />
          <Skeleton className="h-14 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/**
 * Page Header Skeleton
 */
function PageHeaderSkeleton({ 
  withButton = true 
}: { 
  withButton?: boolean 
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-32" />
      </div>
      {withButton && <Skeleton className="h-10 w-32" />}
    </div>
  )
}

export { 
  Skeleton, 
  CardSkeleton, 
  ProductGridSkeleton,
  TextSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  HeroSkeleton,
  PageHeaderSkeleton
}
