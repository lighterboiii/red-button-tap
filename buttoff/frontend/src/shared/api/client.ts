import { API_BASE } from '@shared/config/env';
import type { TapResult } from '@entities/outcome';
import { getTelegramInitData } from '@shared/lib/telegramInitData';

function url(path: string) {
  return `${API_BASE}${path}`;
}

function telegramHeaders(): HeadersInit {
  const initData = getTelegramInitData();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (initData) {
    h.Authorization = `tma ${initData}`;
  }
  return h;
}

export async function postTap(): Promise<TapResult> {
  const res = await fetch(url('/api/tap'), {
    method: 'POST',
    headers: telegramHeaders(),
    body: '{}',
  });
  if (!res.ok) throw new Error(`tap ${res.status}`);
  return res.json() as Promise<TapResult>;
}
