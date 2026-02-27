import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline'

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'border-primary/30 bg-primary/10 text-foreground',
  secondary: 'border-border bg-card text-muted-foreground',
  outline: 'border-border bg-transparent text-muted-foreground',
}

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}
