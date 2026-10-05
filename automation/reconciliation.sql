-- Forge Funnel operator reconciliation: read-only review for at-most-once sends.
-- This query never retries, releases, or mutates a claim.
-- Review manually before taking any separate operational action.

select
  ns.lead_id,
  l.email,
  l.source_tool,
  l.intent,
  ns.sequence_step,
  ns.status,
  ns.claimed_at,
  now() - ns.claimed_at as claim_age,
  ns.sent_at
from nurture_sends ns
join leads l on l.id = ns.lead_id
where ns.status = 'claimed'
order by ns.claimed_at asc;

-- Optional focused view for claims older than 15 minutes:
-- select *
-- from (
--   select ns.lead_id, l.email, l.source_tool, ns.sequence_step, ns.status,
--          ns.claimed_at, now() - ns.claimed_at as claim_age
--   from nurture_sends ns
--   join leads l on l.id = ns.lead_id
--   where ns.status = 'claimed'
-- ) claimed
-- where claim_age > interval '15 minutes'
-- order by claimed_at asc;
