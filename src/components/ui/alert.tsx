import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Alert Component
 * 
 * Consistent alert/notification styles following the SALT design system.
 * Use for displaying important messages, warnings, errors, and success states.
 */

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200 flex items-start gap-3",
  {
    variants: {
      variant: {
        /**
         * Default alert - Subtle gray-green
         * Use for general informational messages
         */
        default:
          "bg-muted/50 border-border text-foreground",
        
        /**
         * Primary alert - Sage green
         * Use for primary notifications
         */
        primary:
          "bg-primary/5 border-primary/20 text-primary-dark",
        
        /**
         * Success alert - Green
         * Use for successful operations, confirmations
         */
        success:
          "bg-[#007749]/5 border-[#007749]/20 text-[#007749]",
        
        /**
         * Warning alert - Yellow/Orange
         * Use for warnings, cautions
         */
        warning:
          "bg-[#FFB81C]/5 border-[#FFB81C]/20 text-[#B8860B]",
        
        /**
         * Destructive alert - Red
         * Use for errors, destructive actions, critical issues
         */
        destructive:
          "bg-destructive/5 border-destructive/20 text-destructive",
        
        /**
         * Accent alert - Terracotta
         * Use for highlighted notifications
         */
        accent:
          "bg-accent/5 border-accent/20 text-accent",
        
        /**
         * Info alert - Blue
         * Use for informational messages, tips
         */
        info:
          "bg-[#001489]/5 border-[#001489]/20 text-[#001489]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * Alert Title Component
 * 
 * Bold title text for alerts.
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-semibold leading-none tracking-tight font-display",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/**
 * Alert Description Component
 * 
 * Regular text description for alerts.
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 font-lora leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
