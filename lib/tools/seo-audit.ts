import { completeText } from '@/lib/providers/openai';
import { withAiGuard } from '@/lib/guard/with-guard';
import { fetchPublicResource } from '@/lib/net-safe';
import type { AuditResult, Check } from '@/lib/types';

async function safeFetch(url: string) {
  const { body } = await fetchPublicResource(url, 1_000_000, 12_000, { 'user-agent': 'ForgeFunnelAudit/1.0' });
  return body.toString('utf8').slice(0, 120_000);
}

export async function runSeoAudit(url: string, ip: string): Promise<AuditResult> {
  const html = await safeFetch(url);
  const head = html.slice(0, 20_000);
  const checks: Check[] = [
    { id: 'title', label: 'Title tag', pass: /<title[^>]*>.+?<\/title>/is.test(head), detail: '' },
    { id: 'meta', label: 'Meta description', pass: /<meta[^>]+name=["']description["'][^>]*>/i.test(head), detail: '' },
    { id: 'h1', label: 'Single H1', pass: (head.match(/<h1\b/gi) ?? []).length === 1, detail: '' },
    { id: 'og', label: 'OpenGraph tags', pass: /property=["']og:/i.test(head), detail: '' },
    { id: 'canon', label: 'Canonical tag', pass: /rel=["']canonical["']/i.test(head), detail: '' },
    { id: 'viewport', label: 'Mobile viewport', pass: /name=["']viewport["']/i.test(head), detail: '' },
    { id: 'schema', label: 'JSON-LD schema', pass: /application\/ld\+json/i.test(head), detail: '' },
    { id: 'https', label: 'HTTPS', pass: url.startsWith('https://'), detail: '' },
  ].map((check) => ({ ...check, detail: check.pass ? 'Detected in the page source.' : 'Missing from the page source.' }));
  const score = Math.round((checks.filter((check) => check.pass).length / checks.length) * 100);
  const failed = checks.filter((check) => !check.pass).map((check) => check.label).join(', ') || 'none';
  let ai: string | null = null;
  try {
    ai = await withAiGuard(`audit:${ip}`, 0.006, async () => completeText([
      { role: 'system', content: 'Return only a JSON array of up to five objects with issue, fix, and tool. tool must be a generic category, never a brand.' },
      { role: 'user', content: `URL: ${url}\nFailed checks: ${failed}` },
    ]));
  } catch (error) {
    console.error('audit provider fallback', error);
  }
  let recommendations: AuditResult['recommendations'] = checks.filter((check) => !check.pass).slice(0, 5).map((check) => ({ issue: check.label, fix: `Add a valid ${check.label.toLowerCase()} to improve crawlability and sharing previews.`, tool: 'technical SEO tool' }));
  if (ai) {
    try { const parsed = JSON.parse(ai); if (Array.isArray(parsed)) recommendations = parsed.slice(0, 5); } catch { /* keep deterministic recommendations */ }
  }
  return { url, score, checks, recommendations };
}
