import { GEAR_SLOTS, MAX_INVENTORY_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { clampLevel, grantXp, xpToNextLevel, MAX_LEVEL, XP_TAP_DAILY_CAP } from '@entities/progression';
import { todayKey } from '@features/tap-session/model/storage';

const KEY = 'buttoff_gear_v5';

const LEGACY_KEYS = ['buttoff_gear_v4', 'buttoff_gear_v3', 'buttoff_gear_v2', 'buttoff_gear_v1'] as const;

export type GearDressingStored = {
  v: 5;
  dayKey: string;
  /** Уровень 1..MAX_LEVEL */
  level: number;
  /** Текущий опыт в полоске до следующего уровня */
  xp: number;
  /** Сколько XP сегодня уже получено с тапов (лимит XP_TAP_DAILY_CAP) */
  tapXpDay: number;
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
    v: 5,
    dayKey: day,
    level: 1,
    xp: 0,
    tapXpDay: 0,
    inventory: [],
    equipped: emptyEquipped(),
    critChanceFromTaps: 0,
  };
}

function normalizeProgression(s: GearDressingStored): GearDressingStored {
  let level = clampLevel(s.level);
  let xp = Math.max(0, Math.floor(Number.isFinite(s.xp) ? s.xp : 0));
  const tapXpDay = Math.min(XP_TAP_DAILY_CAP, Math.max(0, Math.floor(Number.isFinite(s.tapXpDay) ? s.tapXpDay : 0)));
  while (level < MAX_LEVEL && xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level += 1;
  }
  if (level >= MAX_LEVEL) {
    return { ...s, level: MAX_LEVEL, xp: 0, tapXpDay };
  }
  return { ...s, level, xp, tapXpDay };
}

function applyNewDay(s: GearDressingStored): GearDressingStored {
  const day = todayKey();
  if (s.dayKey === day) return s;
  /** Слоты и тап-крит сбрасываются; уровень и опыт остаются между днями */
  const fresh = defaultState();
  return {
    ...fresh,
    level: clampLevel(s.level),
    xp: s.level >= MAX_LEVEL ? 0 : Math.max(0, Math.floor(s.xp)),
    tapXpDay: 0,
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

function parseBodyToV5(parsed: ParsedV4, dayKey: string): GearDressingStored {
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
  return normalizeProgression({
    v: 5,
    dayKey,
    level: 1,
    xp: 0,
    tapXpDay: 0,
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

      if (parsed.v === 5 && parsed.dayKey && typeof parsed.dayKey === 'string') {
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
        const level = typeof pv.level === 'number' ? pv.level : 1;
        const xp = typeof pv.xp === 'number' ? pv.xp : 0;
        const tapXpDay = typeof pv.tapXpDay === 'number' ? pv.tapXpDay : 0;

        let s: GearDressingStored = normalizeProgression({
          v: 5,
          dayKey: parsed.dayKey,
          level,
          xp,
          tapXpDay,
          inventory: inv,
          equipped,
          critChanceFromTaps: crit,
        });
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
        let s = parseBodyToV5(parsed, parsed.dayKey);
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

/** Начислить опыт и сохранить уровень/xp (без изменения tapXpDay) */
export function applyXpGrant(s: GearDressingStored, amount: number): GearDressingStored {
  if (amount <= 0) return s;
  const { level, xp } = grantXp({ level: s.level, xp: s.xp }, amount);
  return normalizeProgression({ ...s, level, xp });
}
