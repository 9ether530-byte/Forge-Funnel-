create extension if not exists pgcrypto;

create table if not exists tool_runs (
  id text primary key,
  slug text not null,
  ip text not null,
  user_id uuid,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  cost numeric not null default 0,
  ms integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source_tool text,
  intent jsonb not null default '{}'::jsonb,
  stack_recommendation jsonb,
  created_at timestamptz not null default now()
);

create table if not exists chat_sessions (
  id text primary key,
  ip text not null,
  lead_id uuid references leads(id) on delete set null,
  messages jsonb not null default '[]'::jsonb,
  extracted_intent jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clicks (
  id uuid primary key default gen_random_uuid(),
  offer_id text not null,
  lead_id uuid references leads(id) on delete set null,
  session_id text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  ip text,
  user_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists rate_limit_buckets (
  key text primary key,
  hits integer not null default 0,
  window_start timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_spend (
  day date primary key,
  spent numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists content_pages (
  slug text primary key,
  title text not null,
  tool_slug text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

create table if not exists nurture_sends (
  lead_id uuid references leads(id) on delete cascade,
  sequence_step text not null,
  status text not null default 'claimed' check (status in ('claimed', 'sent', 'failed')),
  claimed_at timestamptz not null default now(),
  sent_at timestamptz,
  primary key (lead_id, sequence_step)
);

create index if not exists tool_runs_ip_created_at_idx on tool_runs(ip, created_at desc);
create index if not exists clicks_offer_created_at_idx on clicks(offer_id, created_at desc);
create index if not exists events_name_created_at_idx on events(name, created_at desc);
create index if not exists leads_created_at_idx on leads(created_at desc);

alter table tool_runs enable row level security;
alter table leads enable row level security;
alter table chat_sessions enable row level security;
alter table clicks enable row level security;
alter table events enable row level security;
alter table rate_limit_buckets enable row level security;
alter table ai_spend enable row level security;
alter table content_pages enable row level security;
alter table nurture_sends enable row level security;

create or replace function claim_ai_budget(amount numeric, max_budget numeric)
returns boolean language plpgsql security definer as $$
declare current_spend numeric;
begin
  insert into ai_spend(day, spent) values (current_date, 0) on conflict (day) do nothing;
  select spent into current_spend from ai_spend where day = current_date for update;
  if current_spend + amount > max_budget then return false; end if;
  update ai_spend set spent = spent + amount, updated_at = now() where day = current_date;
  return true;
end;
$$;

create or replace function claim_rate_limit(bucket_key text, max_hits integer, window_seconds integer)
returns boolean language plpgsql security definer as $$
declare bucket rate_limit_buckets%rowtype;
begin
  select * into bucket from rate_limit_buckets where key = bucket_key for update;
  if not found then
    insert into rate_limit_buckets(key, hits, window_start) values (bucket_key, 1, now());
    return true;
  end if;
  if extract(epoch from (now() - bucket.window_start)) > window_seconds then
    update rate_limit_buckets set hits = 1, window_start = now(), updated_at = now() where key = bucket_key;
    return true;
  end if;
  if bucket.hits >= max_hits then return false; end if;
  update rate_limit_buckets set hits = hits + 1, updated_at = now() where key = bucket_key;
  return true;
end;
$$;
