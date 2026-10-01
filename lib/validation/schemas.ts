import { z } from 'zod';

export const gptBody = z.object({ text: z.string().min(1).max(5000) });
export const imageBody = z.object({ image: z.string().min(1).max(3_000_000) });
export const headshotBody = z.object({ image: z.string().min(1).max(3_000_000), style: z.enum(['corporate', 'creative', 'linkedin', 'cinematic']) });
export const auditBody = z.object({ url: z.string().url().max(2048) });
export const leadBody = z.object({ email: z.string().email().max(320), sourceTool: z.string().min(1).max(80), intent: z.record(z.unknown()).optional() });
export const chatBody = z.object({ sessionId: z.string().min(8).max(80).optional(), leadId: z.string().uuid().optional(), message: z.string().min(1).max(1000), messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(2000) })).max(7).default([]) });
export const stackBody = z.object({ intent: z.object({ goal: z.string().max(300).optional(), budget: z.enum(['free', 'cheap', 'pro', 'enterprise']).optional(), stage: z.enum(['idea', 'building', 'launched', 'scaling']).optional(), skills: z.array(z.string().max(60)).max(12).optional(), keywords: z.array(z.string().max(60)).max(20).optional() }) });
