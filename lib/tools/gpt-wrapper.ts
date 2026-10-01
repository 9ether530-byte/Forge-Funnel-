import { completeText } from '@/lib/providers/openai';
import { withAiGuard } from '@/lib/guard/with-guard';
import { env } from '@/lib/env';

export async function runGptWrapper(input: string, ip: string) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('EMPTY_INPUT');
  if (trimmed.length > 5000) throw new Error('INPUT_TOO_LONG');
  let providerResult: string | null = null;
  try {
    providerResult = await withAiGuard(`gpt:${ip}`, 0.001, async () => completeText([
      { role: 'system', content: env.nicheSystemPrompt || `You are ${env.niche}. Rewrite the user input to be clear, persuasive, and professional. Return only the rewritten text.` },
      { role: 'user', content: trimmed },
    ]));
  } catch (error) {
    console.error('gpt provider fallback', error);
  }
  if (providerResult) return { text: providerResult, mode: 'openai' as const };
  const normalized = trimmed.replace(/\s+/g, ' ').trim();
  const polished = normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/[.!?]?$/, '.');
  return { text: `A clearer version: ${polished}`, mode: 'local' as const };
}
