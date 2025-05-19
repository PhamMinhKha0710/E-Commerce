import React, { createContext, ReactNode, useContext } from "react"
import { cn } from "@/lib/utils"

// Timeline context
const TimelineContext = createContext<{ position?: "left" | "right" | "alternate"; isLast?: boolean }>({
  position: "left",
  isLast: false,
})

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "left" | "right" | "alternate"
  children: ReactNode
}

export function Timeline({ position = "left", children, className, ...props }: TimelineProps) {
  return (
    <TimelineContext.Provider value={{ position }}>
      <div className={cn("relative flex flex-col gap-2", className)} {...props}>
        {React.Children.toArray(children).map((child, index, arr) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isLast: index === arr.length - 1,
            })
          }
          return child
        })}
      </div>
    </TimelineContext.Provider>
  )
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  isLast?: boolean
  position?: "left" | "right"
}

export function TimelineItem({
  children,
  isLast,
  position: itemPosition,
  className,
  ...props
}: TimelineItemProps) {
  const { position: contextPosition } = useContext(TimelineContext)
  const position = itemPosition || contextPosition

  return (
    <div
      className={cn(
        "flex relative",
        position === "alternate" ? "odd:flex-row even:flex-row-reverse" : 
        position === "right" ? "flex-row-reverse" : "flex-row",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function TimelineSeparator({ children, className, ...props }: TimelineSeparatorProps) {
  return (
    <div
      className={cn("flex flex-col items-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "filled" | "outlined"
  color?: "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  children?: ReactNode
}

export function TimelineDot({
  variant = "filled",
  color = "primary",
  children,
  className,
  ...props
}: TimelineDotProps) {
  const getColorClass = () => {
    if (variant === "outlined") {
      switch (color) {
        case "primary": return "border-primary text-primary"
        case "secondary": return "border-secondary text-secondary"
        case "success": return "border-green-500 text-green-500"
        case "error": return "border-red-500 text-red-500"
        case "info": return "border-blue-500 text-blue-500"
        case "warning": return "border-yellow-500 text-yellow-500"
        default: return "border-gray-400 text-gray-400"
      }
    } else {
      switch (color) {
        case "primary": return "bg-primary text-primary-foreground"
        case "secondary": return "bg-secondary text-secondary-foreground"
        case "success": return "bg-green-500 text-white"
        case "error": return "bg-red-500 text-white"
        case "info": return "bg-blue-500 text-white"
        case "warning": return "bg-yellow-500 text-white"
        default: return "bg-gray-400 text-white"
      }
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 z-10",
        variant === "outlined" ? "border-2" : "",
        getColorClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  isLast?: boolean
}

export function TimelineConnector({ isLast, className, ...props }: TimelineConnectorProps) {
  return (
    !isLast && (
      <div
        className={cn("w-[2px] bg-border grow", className)}
        {...props}
      />
    )
  )
}

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function TimelineContent({ children, className, ...props }: TimelineContentProps) {
  return (
    <div
      className={cn("px-4 py-2 flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TimelineOppositeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function TimelineOppositeContent({ children, className, ...props }: TimelineOppositeContentProps) {
  return (
    <div
      className={cn("px-4 py-2 flex-1 text-right text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
} 