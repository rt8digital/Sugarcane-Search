import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Select Component
 * 
 * Consistent select dropdown styles following the SALT design system.
 */

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Optional error state
   */
  error?: boolean
  /**
   * Optional icon to display on the right
   */
  icon?: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, icon, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            // Base styles
            "flex h-10 w-full appearance-none rounded-md border bg-card px-4 py-2.5 pr-10 text-sm text-foreground",
            "placeholder:text-muted-foreground/60",
            "transition-all duration-200 ease-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
            // Border states
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border hover:border-primary/30 focus-visible:border-primary focus-visible:ring-primary/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon || (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

/**
 * SelectOption Component
 * 
 * Option component for Select with consistent styling.
 */
export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

function SelectOption({ className, ...props }: SelectOptionProps) {
  return (
    <option
      className={cn(
        "bg-card text-foreground py-2 px-3",
        "focus:bg-primary focus:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

SelectOption.displayName = "SelectOption"

export { Select, SelectOption }
