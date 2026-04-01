import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Input Component
 * 
 * Consistent input styles following the SALT design system.
 * Supports all standard HTML input attributes with enhanced styling.
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional error state - adds red border and error styling
   */
  error?: boolean
  /**
   * Optional success state - adds green border
   */
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-md border bg-card px-4 py-2.5 text-sm text-foreground",
          "placeholder:text-muted-foreground/60",
          "transition-all duration-200 ease-smooth",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
          // Border states
          error
            ? "border-destructive focus-visible:ring-destructive"
            : success
            ? "border-primary focus-visible:ring-primary"
            : "border-border hover:border-primary/30 focus-visible:border-primary focus-visible:ring-primary/20",
          // File input styling
          type === "file" && "py-2 px-3 cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

/**
 * Textarea Component
 * 
 * Multi-line text input with consistent styling.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Optional error state
   */
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[100px] w-full rounded-md border bg-card px-4 py-2.5 text-sm text-foreground",
          "placeholder:text-muted-foreground/60",
          "transition-all duration-200 ease-smooth",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
          "resize-y",
          // Border states
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-border hover:border-primary/30 focus-visible:border-primary focus-visible:ring-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

/**
 * Label Component
 * 
 * Consistent label styling for form inputs.
 */
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Optional asterisk for required fields
   */
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-semibold text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "flex items-center gap-1.5",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive" aria-label="required">*</span>
        )}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Input, Textarea, Label }
