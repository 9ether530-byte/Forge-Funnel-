import OpenAI from 'openai';
import { env } from '@/lib/env';

let client: OpenAI | null = null;

export function getOpenAI() {
  if (!env.openAiKey) return null;
  client ??= new OpenAI({ apiKey: env.openAiKey });
  return client;
}

export async function completeText(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], model = 'gpt-4o-mini') {
  const openai = getOpenAI();
  if (!openai) return null;
  const response = await openai.chat.completions.create({ model, messages, temperature: 0.4 });
  return response.choices[0]?.message?.content?.trim() ?? '';
}
