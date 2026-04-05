import { GEAR_SLOTS, MAX_INVENTORY_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { MAX_LEVEL } from '@entities/progression';
import { todayKey } from '@features/tap-session/model/storage';

const KEY = 'buttoff_gear_v6';

const LEGACY_KEYS = ['buttoff_gear_v5', 'buttoff_gear_v4', 'buttoff_gear_v3', 'buttoff_gear_v2', 'buttoff_gear_v1'] as const;

const XP_TAP_CAP = 15;

export type GearDressingStored = {
  v: 6;
  dayKey: string;
  level: number;
  xp: number;
  tapXpDay: number;
  /** С сервера (POST /api/progression/*, battle) */
  xpToNext: number;
  playerMaxHp: number;
  inventory: GearItem[];
  equipped: Record<GearSlot, GearItem | null>;
  critChanceFromTaps: number;
};

export function emptyEquipped(): Record<GearSlot, GearItem | null> {
  return {
    head: null,
    sword: null,
    shield: null,
    shoulders: null,
    chest: null,
  };
}

function defaultState(): GearDressingStored {
  const day = todayKey();
  return {
    v: 6,
    dayKey: day,
    level: 1,
    xp: 0,
    tapXpDay: 0,
    xpToNext: 120,
    playerMaxHp: 12,
    inventory: [],
    equipped: emptyEquipped(),
    critChanceFromTaps: 0,
  };
}

function softClamp(s: GearDressingStored): GearDressingStored {
  return {
    ...s,
    level: Math.min(MAX_LEVEL, Math.max(1, Math.floor(s.level))),
    xp: Math.max(0, Math.floor(s.xp)),
    tapXpDay: Math.min(XP_TAP_CAP, Math.max(0, Math.floor(s.tapXpDay))),
    xpToNext: Math.max(0, Math.floor(s.xpToNext ?? 0)),
    playerMaxHp: Math.max(1, Math.floor(s.playerMaxHp ?? 12)),
  };
}

function applyNewDay(s: GearDressingStored): GearDressingStored {
  const day = todayKey();
  if (s.dayKey === day) return s;
  const fresh = defaultState();
  return {
    ...fresh,
    level: Math.min(MAX_LEVEL, Math.max(1, Math.floor(s.level))),
    xp: s.level >= MAX_LEVEL ? 0 : Math.max(0, Math.floor(s.xp)),
    tapXpDay: 0,
    xpToNext: s.xpToNext,
    playerMaxHp: s.playerMaxHp,
  };
}

function wipeLegacyKeys() {
  for (const k of LEGACY_KEYS) {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}

type ParsedV4 = {
  v?: number;
  dayKey?: string;
  inventory?: GearItem[];
  equipped?: Partial<Record<GearSlot, GearItem | null>>;
  critChanceFromTaps?: unknown;
};

function migrateV5ToV6(parsed: ParsedV4 & Record<string, unknown>, dayKey: string): GearDressingStored {
  const equipped = emptyEquipped();
  for (const slot of GEAR_SLOTS) {
    const e = parsed.equipped?.[slot];
    equipped[slot] = e && typeof e === 'object' && 'id' in e ? (e as GearItem) : null;
  }
  const inv = Array.isArray(parsed.inventory)
    ? parsed.inventory.filter((x): x is GearItem => typeof x?.id === 'string').slice(0, MAX_INVENTORY_SLOTS)
    : [];
  const crit =
    typeof parsed.critChanceFromTaps === 'number' && Number.isFinite(parsed.critChanceFromTaps)
      ? Math.min(1, Math.max(0, parsed.critChanceFromTaps))
      : 0;
  const pv = parsed as Partial<GearDressingStored>;
  return softClamp({
    v: 6,
    dayKey,
    level: typeof pv.level === 'number' ? pv.level : 1,
    xp: typeof pv.xp === 'number' ? pv.xp : 0,
    tapXpDay: typeof pv.tapXpDay === 'number' ? pv.tapXpDay : 0,
    xpToNext: typeof pv.xpToNext === 'number' ? pv.xpToNext : 120,
    playerMaxHp: typeof pv.playerMaxHp === 'number' ? pv.playerMaxHp : 12,
    inventory: inv,
    equipped,
    critChanceFromTaps: crit,
  });
}

export function loadGearDressing(): GearDressingStored {
  try {
    let raw = localStorage.getItem(KEY);
    let legacyKey: string | null = null;
    if (!raw) {
      for (const k of LEGACY_KEYS) {
        const alt = localStorage.getItem(k);
        if (alt) {
          raw = alt;
          legacyKey = k;
          break;
        }
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw) as ParsedV4 & { v?: number };

      if (parsed.v === 6 && parsed.dayKey && typeof parsed.dayKey === 'string') {
        const s = migrateV5ToV6(parsed as Record<string, unknown>, parsed.dayKey);
        const out = applyNewDay(s);
        saveGearDressing(out);
        if (legacyKey) {
          try {
            localStorage.removeItem(legacyKey);
          } catch {
            /* ignore */
          }
        }
        wipeLegacyKeys();
        return out;
      }

      if (parsed.v === 5 && parsed.dayKey && typeof parsed.dayKey === 'string') {
        let s = migrateV5ToV6(parsed as Record<string, unknown>, parsed.dayKey);
        s = applyNewDay(s);
        saveGearDressing(s);
        if (legacyKey) {
          try {
            localStorage.removeItem(legacyKey);
          } catch {
            /* ignore */
          }
        }
        wipeLegacyKeys();
        return s;
      }

      if (parsed.v === 4 && parsed.dayKey && typeof parsed.dayKey === 'string') {
        let s = migrateV5ToV6(parsed as Record<string, unknown>, parsed.dayKey);
        s = applyNewDay(s);
        saveGearDressing(s);
        if (legacyKey) {
          try {
            localStorage.removeItem(legacyKey);
          } catch {
            /* ignore */
          }
        }
        wipeLegacyKeys();
        return s;
      }
    }

    wipeLegacyKeys();
    const s = defaultState();
    saveGearDressing(s);
    return s;
  } catch {
    wipeLegacyKeys();
    const s = defaultState();
    try {
      saveGearDressing(s);
    } catch {
      /* ignore */
    }
    return s;
  }
}

export function saveGearDressing(s: GearDressingStored) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
