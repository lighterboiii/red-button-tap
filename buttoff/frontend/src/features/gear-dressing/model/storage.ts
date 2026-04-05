import { GEAR_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { todayKey } from '@features/tap-session/model/storage';

const KEY = 'buttoff_gear_v1';

export type GearDressingStored = {
  v: 1;
  dayKey: string;
  /** Не надетые вещи */
  inventory: GearItem[];
  /** По одному предмету на слот */
  equipped: Record<GearSlot, GearItem | null>;
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
    v: 1,
    dayKey: day,
    inventory: [],
    equipped: emptyEquipped(),
  };
}

function applyNewDay(s: GearDressingStored): GearDressingStored {
  const day = todayKey();
  if (s.dayKey === day) return s;
  /** Новый день: снова собирать сет и фармить вещи */
  return defaultState();
}

export function loadGearDressing(): GearDressingStored {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<GearDressingStored>;
    if (parsed.v !== 1 || !parsed.dayKey) return defaultState();
    const equipped = emptyEquipped();
    for (const slot of GEAR_SLOTS) {
      const e = parsed.equipped?.[slot];
      equipped[slot] = e && typeof e === 'object' && 'id' in e ? (e as GearItem) : null;
    }
    const inv = Array.isArray(parsed.inventory)
      ? parsed.inventory.filter((x): x is GearItem => typeof x?.id === 'string')
      : [];
    let s: GearDressingStored = {
      v: 1,
      dayKey: parsed.dayKey,
      inventory: inv,
      equipped,
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
