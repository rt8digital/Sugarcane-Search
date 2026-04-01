import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button Component
 * 
 * Consistent button styles following the SALT design system.
 * Supports multiple variants, sizes, and can render as child component with asChild.
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg font-bold tracking-wide transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        /**
         * Primary button - Sage green background
         * Use for main actions and CTAs
         */
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5",

        /**
         * Default button - Dark foreground background
         * Alternative primary action
         */
        default:
          "bg-foreground text-primary-foreground hover:bg-primary shadow-md hover:shadow-lg hover:-translate-y-0.5",

        /**
         * Secondary button - Warm beige background
         * Use for secondary actions
         */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:-translate-y-0.5",

        /**
         * Outline button - Border only with prominent border
         * Use for tertiary actions or when visual weight should be minimal
         */
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5",

        /**
         * Ghost button - No background, subtle hover
         * Use for low-emphasis actions
         */
        ghost:
          "bg-transparent text-foreground font-semibold hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5",

        /**
         * Destructive button - For dangerous actions
         * Use for delete, remove, destructive operations
         */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:-translate-y-0.5",

        /**
         * Accent button - Terracotta color
         * Use for special highlights or alternative CTAs
         */
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5",

        /**
         * Link button - Text-only with underline on hover
         * Use for navigation or external links styled as buttons
         */
        link:
          "bg-transparent text-primary font-semibold underline-offset-4 hover:underline p-0 h-auto shadow-none hover:shadow-none hover:-translate-y-0",
      },
      size: {
        /**
         * Extra small - For compact spaces (minimum accessible size)
         */
        xs: "h-9 px-4 text-xs rounded-md",

        /**
         * Small - For toolbars, dense layouts
         */
        sm: "h-11 px-5 text-sm rounded-lg",

        /**
         * Default - Standard size for most use cases (prominent)
         */
        default: "h-12 px-6 py-3 text-base rounded-lg",

        /**
         * Large - For prominent CTAs
         */
        lg: "h-14 px-10 py-4 text-lg rounded-xl",

        /**
         * Extra large - For hero sections
         */
        xl: "h-16 px-12 py-5 text-xl rounded-2xl",

        /**
         * Icon only - Square button for icons
         */
        icon: "h-12 w-12 rounded-lg",

        /**
         * Icon small - Compact icon button (minimum accessible)
         */
        iconSm: "h-10 w-10 rounded-lg",

        /**
         * Icon large - Prominent icon button
         */
        iconLg: "h-14 w-14 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, renders the button as a child component (e.g., Link)
   * while maintaining button styles and behavior
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
