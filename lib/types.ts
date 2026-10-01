export type ToolSlug = 'gpt-wrapper' | 'bg-remover' | 'upscaler' | 'headshot' | 'seo-audit';

export type Intent = {
  goal?: string;
  budget?: 'free' | 'cheap' | 'pro' | 'enterprise';
  stage?: 'idea' | 'building' | 'launched' | 'scaling';
  skills?: string[];
  keywords?: string[];
  score?: number;
};

export type ToolResult = {
  slug: ToolSlug;
  runId: string;
  quota: { used: number; limit: number };
};

export type Check = { id: string; label: string; pass: boolean; detail: string };

export type AuditResult = {
  url: string;
  score: number;
  checks: Check[];
  recommendations: { issue: string; fix: string; tool: string }[];
};
