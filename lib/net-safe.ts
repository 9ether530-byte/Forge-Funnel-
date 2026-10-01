import dns from 'node:dns/promises';

const MAX_REDIRECTS = 3;

function isBlockedIp(address: string) {
  const value = address.toLowerCase();
  if (value === '::1' || value === '0.0.0.0' || value === '::' || value.startsWith('127.') || value.startsWith('10.') || value.startsWith('192.168.') || value.startsWith('169.254.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(value)) return true;
  if (value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80:') || value.startsWith('::ffff:127.') || value.startsWith('::ffff:10.') || value.startsWith('::ffff:192.168.')) return true;
  return false;
}

async function assertPublicUrl(url: URL) {
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('URL_PROTOCOL');
  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.internal') || hostname.endsWith('.local')) throw new Error('URL_PRIVATE_NETWORK');
  const addresses = await dns.lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isBlockedIp(address))) throw new Error('URL_PRIVATE_NETWORK');
}

export async function fetchPublicResource(input: string, maxBytes: number, timeoutMs: number, headers: HeadersInit = {}) {
  let url = new URL(input);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    await assertPublicUrl(url);
    const response = await fetch(url, { headers, redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirects === MAX_REDIRECTS) throw new Error('URL_REDIRECT_LIMIT');
      url = new URL(location, url);
      continue;
    }
    if (!response.ok) throw new Error('URL_FETCH_FAILED');
    const length = Number(response.headers.get('content-length') || 0);
    if (length > maxBytes) throw new Error('URL_TOO_LARGE');
    const body = Buffer.from(await response.arrayBuffer());
    if (body.byteLength > maxBytes) throw new Error('URL_TOO_LARGE');
    return { body, url: url.toString() };
  }
  throw new Error('URL_REDIRECT_LIMIT');
}
