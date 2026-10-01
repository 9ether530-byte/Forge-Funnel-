import Link from 'next/link';

export function SiteFooter() {
  return <footer className="border-t border-line/70"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-mist sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><span className="font-mono text-paper">FORGE/FUNNEL</span><p className="mt-2 max-w-sm leading-6">Useful tools for the messy middle between an idea and a working system.</p></div><div className="flex gap-5"><Link href="/privacy" className="hover:text-paper">Privacy</Link><Link href="/terms" className="hover:text-paper">Terms</Link><Link href="/chat" className="hover:text-paper">Advisor</Link></div></div></footer>;
}
