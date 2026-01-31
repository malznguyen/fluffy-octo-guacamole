import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-white shadow hover:bg-neutral-800",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline: "border-2 border-neutral-200 text-neutral-900 hover:border-rose-500 hover:text-rose-600",
        // Fashion accent variants
        rose:
          "border-transparent bg-rose-600 text-white shadow hover:bg-rose-700",
        "rose-light":
          "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        // Status badges (solid colors, no gradients)
        pending:
          "border-amber-200 bg-amber-100 text-amber-800",
        confirmed:
          "border-blue-200 bg-blue-100 text-blue-800",
        shipped:
          "border-indigo-200 bg-indigo-100 text-indigo-800",
        delivered:
          "border-emerald-200 bg-emerald-100 text-emerald-800",
        completed:
          "border-rose-200 bg-rose-100 text-rose-800",
        cancelled:
          "border-red-200 bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
