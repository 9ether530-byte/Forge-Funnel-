import * as React from 'react';
import { cn } from '@/lib/cn';

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'dark' }) {
  return <button className={cn('inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:cursor-not-allowed disabled:opacity-50', variant === 'primary' && 'bg-signal text-ink hover:bg-white', variant === 'ghost' && 'border border-line bg-transparent text-paper hover:border-signal hover:text-signal', variant === 'dark' && 'bg-panel text-paper hover:bg-line', className)} {...props} />;
}
