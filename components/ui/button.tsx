import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

type ButtonVariantOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

export function buttonVariants({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  className,
}: ButtonVariantOptions = {}) {
  const base =
    'focus-ring inline-flex items-center justify-center gap-2 rounded-md border text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50'

  const variants: Record<ButtonVariant, string> = {
    primary: 'border-primary bg-primary text-primary-foreground hover:brightness-95 active:brightness-90',
    secondary: 'border-border bg-card text-foreground hover:bg-muted active:bg-muted/80',
    outline: 'border-border bg-background text-foreground hover:bg-muted active:bg-muted/80',
    ghost: 'border-transparent bg-transparent text-foreground hover:bg-muted active:bg-muted/80',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-xs',
    default: 'h-11 px-5',
    lg: 'h-12 px-7',
    icon: 'h-10 w-10',
  }

  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
