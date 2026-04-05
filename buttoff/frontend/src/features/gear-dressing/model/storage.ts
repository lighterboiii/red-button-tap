import { GEAR_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { todayKey } from '@features/tap-session/model/storage';

const KEY = 'buttoff_gear_v2';

export type GearDressingStored = {
  v: 2;
  dayKey: string;
  inventory: GearItem[];
  equipped: Record<GearSlot, GearItem | null>;
  /** Шанс крита 0..1, копится случайно с тапов */
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
    v: 2,
    dayKey: day,
    inventory: [],
    equipped: emptyEquipped(),
    critChanceFromTaps: 0,
  };
}

function applyNewDay(s: GearDressingStored): GearDressingStored {
  const day = todayKey();
  if (s.dayKey === day) return s;
  return defaultState();
}

type LegacyV1 = {
  v?: number;
  dayKey?: string;
  inventory?: GearItem[];
  equipped?: Partial<Record<GearSlot, GearItem | null>>;
};

function migrateFromV1(legacy: LegacyV1): GearDressingStored {
  const base = defaultState();
  const day = legacy.dayKey ?? base.dayKey;
  const equipped = emptyEquipped();
  for (const slot of GEAR_SLOTS) {
    const e = legacy.equipped?.[slot];
    equipped[slot] = e && typeof e === 'object' && 'id' in e ? (e as GearItem) : null;
  }
  const inv = Array.isArray(legacy.inventory)
    ? legacy.inventory.filter((x): x is GearItem => typeof x?.id === 'string')
    : [];
  return {
    v: 2,
    dayKey: day,
    inventory: inv,
    equipped,
    critChanceFromTaps: 0,
  };
}

export function loadGearDressing(): GearDressingStored {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const legacy = localStorage.getItem('buttoff_gear_v1');
      if (legacy) {
        try {
          const m = migrateFromV1(JSON.parse(legacy) as LegacyV1);
          const next = applyNewDay(m);
          saveGearDressing(next);
          localStorage.removeItem('buttoff_gear_v1');
          return next;
        } catch {
          /* ignore */
        }
      }
      return defaultState();
    }
    type ParsedBlob = LegacyV1 & { v?: number; critChanceFromTaps?: unknown };
    const parsed = JSON.parse(raw) as ParsedBlob;
    if (parsed.v === 1) {
      const m = migrateFromV1(parsed);
      const next = applyNewDay(m);
      saveGearDressing(next);
      return next;
    }
    if (parsed.v !== 2 || !parsed.dayKey) return defaultState();
    const equipped = emptyEquipped();
    for (const slot of GEAR_SLOTS) {
      const e = parsed.equipped?.[slot];
      equipped[slot] = e && typeof e === 'object' && 'id' in e ? (e as GearItem) : null;
    }
    const inv = Array.isArray(parsed.inventory)
      ? parsed.inventory.filter((x): x is GearItem => typeof x?.id === 'string')
      : [];
    const crit =
      typeof parsed.critChanceFromTaps === 'number' && Number.isFinite(parsed.critChanceFromTaps)
        ? Math.min(1, Math.max(0, parsed.critChanceFromTaps))
        : 0;
    let s: GearDressingStored = {
      v: 2,
      dayKey: parsed.dayKey,
      inventory: inv,
      equipped,
      critChanceFromTaps: crit,
    };
    s = applyNewDay(s);
    return s;
  } catch {
    return defaultState();
  }
}

export function saveGearDressing(s: GearDressingStored) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
