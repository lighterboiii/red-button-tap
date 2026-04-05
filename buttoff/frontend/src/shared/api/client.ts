import { API_BASE } from '@shared/config/env';
import type { TapResult } from '@entities/outcome';

function url(path: string) {
  return `${API_BASE}${path}`;
}

export async function postTap(): Promise<TapResult> {
  const res = await fetch(url('/api/tap'), { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`tap ${res.status}`);
  return res.json() as Promise<TapResult>;
}
