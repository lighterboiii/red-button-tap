import { GEAR_SLOTS, MAX_INVENTORY_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { todayKey } from '@features/tap-session/model/storage';

const KEY = 'buttoff_gear_v4';

const LEGACY_KEYS = ['buttoff_gear_v3', 'buttoff_gear_v2', 'buttoff_gear_v1'] as const;

export type GearDressingStored = {
  v: 4;
  dayKey: string;
  inventory: GearItem[];
  equipped: Record<GearSlot, GearItem | null>;
  /** Шанс крита 0..1, копится при взятии дропа с тапа */
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
    v: 4,
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

function wipeLegacyKeys() {
  for (const k of LEGACY_KEYS) {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}

type ParsedStored = {
  v?: number;
  dayKey?: string;
  inventory?: GearItem[];
  equipped?: Partial<Record<GearSlot, GearItem | null>>;
  critChanceFromTaps?: unknown;
};

export function loadGearDressing(): GearDressingStored {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ParsedStored;
      if (parsed.v === 4 && parsed.dayKey && typeof parsed.dayKey === 'string') {
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
        let s: GearDressingStored = {
          v: 4,
          dayKey: parsed.dayKey,
          inventory: inv,
          equipped,
          critChanceFromTaps: crit,
        };
        s = applyNewDay(s);
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
