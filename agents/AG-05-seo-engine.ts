import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { completeText } from '@/lib/providers/openai';
import { withAiGuard } from '@/lib/guard/with-guard';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const TOOLS = [
  { slug: 'gpt-wrapper', title: 'AI text rewriter', task: 'rewrite text' },
  { slug: 'bg-remover', title: 'background remover', task: 'remove an image background' },
  { slug: 'upscaler', title: 'image upscaler', task: 'upscale image resolution' },
  { slug: 'headshot', title: 'AI headshot generator', task: 'create a professional headshot' },
  { slug: 'seo-audit', title: 'SEO audit tool', task: 'audit website SEO' },
];
const MODIFIERS = [(t: string) => `free ${t}`, (t: string) => `${t} for small business`, (t: string) => `how to ${t}`, (t: string) => `best ${t} tools`];

export async function generateCluster(outputDir = join(process.cwd(), 'content/tools')) {
  await mkdir(outputDir, { recursive: true });
  let written = 0;
  const jobs = TOOLS.flatMap((tool) => MODIFIERS.map((modifier) => ({ tool, keyword: modifier(tool.title) }))).slice(0, 5);
  const db = getSupabaseAdmin();
  if (process.env.NODE_ENV === 'production' && !db) throw new Error('CONTENT_STORE_UNAVAILABLE');
  for (const { tool, keyword } of jobs) {
    const response = await withAiGuard(`seo-content:${keyword}`, 0.004, () => completeText([{ role: 'system', content: 'Return JSON with h1, intro, sections, and faq for an SEO landing page. No brand names or affiliate links.' }, { role: 'user', content: `Keyword: ${keyword}\nTool: ${tool.title}\nTask: ${tool.task}` }]));
    if (!response) continue;
    const file = `${keyword.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.mdx`;
    const body = `---\ntitle: "${keyword}"\ntool: "${tool.slug}"\n---\n\n${response}\n`;
    if (db) await db.from('content_pages').upsert({ slug: file.replace(/\.mdx$/, ''), title: keyword, tool_slug: tool.slug, body, updated_at: new Date().toISOString() }, { onConflict: 'slug' });
    else await writeFile(join(outputDir, file), body);
    written++;
  }
  return { written };
}
