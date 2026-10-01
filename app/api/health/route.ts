export async function GET() {
  return Response.json({ ok: true, service: 'forge-funnel', timestamp: new Date().toISOString() }, { headers: { 'cache-control': 'no-store' } });
}
