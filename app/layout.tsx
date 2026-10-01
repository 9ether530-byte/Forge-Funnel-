import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Forge Funnel — useful AI tools for the messy middle', template: '%s — Forge Funnel' },
  description: 'Five free tools to turn rough inputs into useful output, then a focused advisor to help you choose the next layer.',
  keywords: ['free AI tools', 'SEO audit', 'image upscaler', 'background remover', 'AI headshot'],
  openGraph: { type: 'website', siteName: 'Forge Funnel', title: 'Forge Funnel — useful AI tools for the messy middle', description: 'Free tools first. Smarter stack second.' },
  twitter: { card: 'summary_large_image', title: 'Forge Funnel', description: 'Free tools first. Smarter stack second.' },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
