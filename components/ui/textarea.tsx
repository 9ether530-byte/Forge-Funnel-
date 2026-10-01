import * as React from 'react';
import { cn } from '@/lib/cn';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => <textarea ref={ref} className={cn('min-h-36 w-full resize-y rounded-2xl border border-line bg-ink px-4 py-3 text-sm leading-6 text-paper outline-none placeholder:text-mist/70 focus:border-signal focus:ring-2 focus:ring-signal/20', className)} {...props} />);
Textarea.displayName = 'Textarea';
