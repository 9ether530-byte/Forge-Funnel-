import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() { return <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col justify-center px-5 py-16"><p className="eyebrow text-ember">404 / not found</p><h1 className="mt-5 text-5xl font-semibold tracking-[-.06em] text-paper">That route is not in the forge.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-mist">The page may have moved, or it may never have been built. Start with the toolkit instead.</p><Link href="/tools" className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-ink"><ArrowLeft className="size-4" />Open free tools</Link></main>; }
