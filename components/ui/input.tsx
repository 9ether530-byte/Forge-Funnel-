import * as React from 'react';
import { cn } from '@/lib/cn';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} className={cn('min-h-12 w-full rounded-2xl border border-line bg-ink px-4 text-sm text-paper outline-none placeholder:text-mist/70 focus:border-signal focus:ring-2 focus:ring-signal/20', className)} {...props} />);
Input.displayName = 'Input';
