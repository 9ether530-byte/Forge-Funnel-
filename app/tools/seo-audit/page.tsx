import type { Metadata } from 'next';
import { ToolShell } from '@/components/tool-shell';
import { ToolWorkbench } from '@/components/tool-workbench';

export const metadata: Metadata = { title: 'Free SEO audit tool', description: 'Run a free SEO audit that checks the fundamentals and gives you concrete fixes.' };

export default function SeoAuditPage() { return <ToolShell eyebrow="Tool 05 / B2B" title="Find the quiet leaks in your SEO." description="Enter a public URL and get a technical snapshot: title, description, headings, sharing tags, schema, mobile setup, and HTTPS." slug="/tools/seo-audit" note="The audit is intentionally concrete. It tells you what is missing, not just that something feels off."><ToolWorkbench mode="audit" slug="seo-audit" label="Website URL" prompt="https://your-site.com" action="Run free audit" /></ToolShell>; }
