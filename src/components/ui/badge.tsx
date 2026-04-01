import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Badge Component
 * 
 * Consistent badge styles following the SALT design system.
 * Use for status indicators, tags, counts, and small labels.
 */

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-200 ease-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        /**
         * Primary badge - Sage green
         * Use for primary status indicators
         */
        primary:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        
        /**
         * Secondary badge - Warm beige
         * Use for secondary information
         */
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        /**
         * Muted badge - Subtle gray-green
         * Use for low-emphasis labels
         */
        muted:
          "border-border bg-muted text-muted-foreground hover:bg-muted/80",
        
        /**
         * Accent badge - Terracotta
         * Use for highlights or important notices
         */
        accent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        
        /**
         * Destructive badge - Red
         * Use for errors, warnings, or destructive states
         */
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        
        /**
         * Outline badge - Border only
         * Use for neutral labels or filters
         */
        outline:
          "border-border text-foreground hover:bg-muted/50",
        
        /**
         * Success badge - Green
         * Use for positive confirmations
         */
        success:
          "border-transparent bg-[#007749] text-white hover:bg-[#007749]/80",
        
        /**
         * Info badge - Blue
         * Use for informational messages
         */
        info:
          "border-transparent bg-[#001489] text-white hover:bg-[#001489]/80",
      },
      size: {
        /**
         * Small - For compact spaces
         */
        sm: "px-2 py-0.5 text-[10px] h-5",
        
        /**
         * Default - Standard size
         */
        default: "px-2.5 py-1 text-xs h-6",
        
        /**
         * Large - For prominent badges
         */
        lg: "px-3.5 py-1.5 text-sm h-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Optional icon to display before the badge content
   */
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  )
}

Badge.displayName = "Badge"

/**
 * Tag Component
 * 
 * A variant of badge designed for tags with removable functionality.
 */
export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Tag label
   */
  label: string
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void
  /**
   * Accessibility label for remove button
   */
  removeAriaLabel?: string
}

function Tag({
  label,
  variant = "muted",
  size = "default",
  onRemove,
  removeAriaLabel = "Remove tag",
  className,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        badgeVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label={removeAriaLabel}
          type="button"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export { Badge, badgeVariants, Tag }
