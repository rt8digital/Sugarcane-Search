import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 * 
 * Placeholder component for loading states.
 * Use to show content structure while data is loading.
 */

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animation variant
   * - pulse: Standard pulse animation
   * - shimmer: Shimmer effect (requires additional CSS)
   */
  animation?: 'pulse' | 'shimmer'
}

function Skeleton({
  className,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded-md",
        animation === 'shimmer' && "relative overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * Skeleton Text Component
 * 
 * Skeleton placeholder for text content.
 */
interface SkeletonTextProps {
  lines?: number
  className?: string
  maxLength?: number
}

function SkeletonText({
  lines = 1,
  className,
  maxLength,
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 w-full",
            i === lines - 1 && maxLength ? `w-[${maxLength}%]` : ""
          )}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton Card Component
 * 
 * Skeleton placeholder for card components.
 */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-6", className)}>
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonCard }
