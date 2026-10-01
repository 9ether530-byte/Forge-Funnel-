import { cn } from '@/lib/cn';

export function Badge({ children, className, tone = 'muted' }: { children: React.ReactNode; className?: string; tone?: 'muted' | 'signal' | 'ember' }) {
  return <span className={cn('inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]', tone === 'signal' && 'border-signal/40 bg-signal/10 text-signal', tone === 'ember' && 'border-ember/40 bg-ember/10 text-ember', tone === 'muted' && 'border-line bg-panel text-mist', className)}>{children}</span>;
}
