import { API_BASE } from '@shared/config/env';
import type {
  BattleCommitResponse,
  BattleOpponentResponse,
  CombatPreviewResponse,
  EnemyProfile,
} from '@entities/combat';
import type { ProgressionSnapshot, PlayerProgressionPayload } from '@entities/progression';
import type { TapResult } from '@entities/outcome';
import type { GearItem, GearSlot } from '@entities/gear';
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
  const text = await res.text();
  if (!res.ok) {
    let detail = '';
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j?.error) detail = ` (${j.error})`;
    } catch {
      if (text && !text.startsWith('<')) detail = ` ${text.slice(0, 100)}`;
    }
    throw new Error(`Ошибка API ${res.status}${detail}`);
  }
  return JSON.parse(text) as TapResult;
}

export async function postCombatPreview(
  equipped: Record<GearSlot, GearItem | null>,
  inventory: GearItem[],
  critChanceFromTaps: number,
): Promise<CombatPreviewResponse> {
  const res = await fetch(url('/api/combat/preview'), {
    method: 'POST',
    headers: telegramHeaders(),
    body: JSON.stringify({ equipped, inventory, critChanceFromTaps }),
  });
  const text = await res.text();
  if (!res.ok) {
    let detail = '';
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j?.error) detail = ` (${j.error})`;
    } catch {
      /* ignore */
    }
    throw new Error(`Ошибка API ${res.status}${detail}`);
  }
  return JSON.parse(text) as CombatPreviewResponse;
}

export async function postProgressionSync(body: {
  progression: PlayerProgressionPayload;
}): Promise<ProgressionSnapshot> {
  const res = await fetch(url('/api/progression/sync'), {
    method: 'POST',
    headers: telegramHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Ошибка API ${res.status}`);
  return JSON.parse(text) as ProgressionSnapshot;
}

export async function postProgressionTapTake(body: {
  progression: PlayerProgressionPayload;
}): Promise<ProgressionSnapshot> {
  const res = await fetch(url('/api/progression/tap-take'), {
    method: 'POST',
    headers: telegramHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Ошибка API ${res.status}`);
  return JSON.parse(text) as ProgressionSnapshot;
}

export async function postBattleOpponent(body: {
  battleKind: 'random' | 'spar';
  equipped: Record<GearSlot, GearItem | null>;
  critChanceFromTaps: number;
  progression: PlayerProgressionPayload;
}): Promise<BattleOpponentResponse> {
  const res = await fetch(url('/api/battle/opponent'), {
    method: 'POST',
    headers: telegramHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    let detail = '';
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j?.error) detail = ` (${j.error})`;
    } catch {
      if (text && !text.startsWith('<')) detail = ` ${text.slice(0, 100)}`;
    }
    throw new Error(`Ошибка API ${res.status}${detail}`);
  }
  return JSON.parse(text) as BattleOpponentResponse;
}

export async function postBattle(body: {
  battleKind: 'random' | 'spar';
  equipped: Record<GearSlot, GearItem | null>;
  critChanceFromTaps: number;
  enemy: EnemyProfile;
  progression: PlayerProgressionPayload;
}): Promise<BattleCommitResponse> {
  const res = await fetch(url('/api/battle'), {
    method: 'POST',
    headers: telegramHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    let detail = '';
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j?.error) detail = ` (${j.error})`;
    } catch {
      if (text && !text.startsWith('<')) detail = ` ${text.slice(0, 100)}`;
    }
    throw new Error(`Ошибка API ${res.status}${detail}`);
  }
  return JSON.parse(text) as BattleCommitResponse;
}
