import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Dialog Component
 * 
 * Accessible modal dialog following the SALT design system.
 * Built with native HTML dialog element for better accessibility.
 */

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }

    const handleCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "fixed inset-0 z-[200] m-auto w-full max-w-[90vw] rounded-lg border border-border bg-card p-0 shadow-2xl backdrop:bg-foreground/60 backdrop:backdrop-blur-sm",
        "open:animate-in open:fade-in open:zoom-in-95",
        "close:animate-out close:fade-out close:zoom-out-95",
        sizeClasses[size]
      )}
    >
      <div className="flex flex-col">
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="space-y-1">
              {title && (
                <h2 className="text-lg font-semibold font-display text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground font-lora">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                aria-label="Close dialog"
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4 bg-muted/30">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  )
}

/**
 * Dialog Trigger Component
 * 
 * Button that opens a dialog.
 */
interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onOpen: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
}

function DialogTrigger({
  onOpen,
  variant = 'primary',
  className,
  children,
  ...props
}: DialogTriggerProps) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-muted',
    outline: 'border border-primary/30 text-primary hover:bg-primary/5',
  }

  return (
    <button
      onClick={onOpen}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Dialog, DialogTrigger }
