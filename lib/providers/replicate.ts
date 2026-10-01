import Replicate from 'replicate';
import { env } from '@/lib/env';

let client: Replicate | null = null;

export function getReplicate() {
  if (!env.replicateToken) return null;
  client ??= new Replicate({ auth: env.replicateToken });
  return client;
}

export async function runImageModel(model: `${string}/${string}` | `${string}/${string}:${string}`, input: Record<string, unknown>) {
  const replicate = getReplicate();
  if (!replicate) return null;
  const output = await replicate.run(model, { input });
  if (Array.isArray(output)) return String(output[0] ?? '');
  return String(output ?? '');
}
