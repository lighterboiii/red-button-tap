import type { GearItem, GearSlot } from '@entities/gear';
import type { Rarity } from '@entities/outcome/model/rarity';
import { CRIT_FROM_GEAR_CAP } from './battleConstants';

/** База за редкость предмета */
const RARITY_BASE: Record<Rarity, { atk: number; def: number }> = {
  common: { atk: 3, def: 3 },
  uncommon: { atk: 6, def: 5 },
  rare: { atk: 10, def: 8 },
  legendary: { atk: 16, def: 12 },
};

/** Слот смещает баланс в сторону удара или брони (HoMM-стиль) */
const SLOT_BIAS: Record<GearSlot, { atk: number; def: number }> = {
  head: { atk: 0.35, def: 0.65 },
  sword: { atk: 1.25, def: 0.35 },
  shield: { atk: 0.25, def: 1.2 },
  shoulders: { atk: 0.55, def: 0.75 },
  chest: { atk: 0.4, def: 1.0 },
};

/** База крита за редкость (множится на склонность слота) */
const RARITY_CRIT_BASE: Record<Rarity, number> = {
  common: 0.016,
  uncommon: 0.024,
  rare: 0.032,
  legendary: 0.042,
};

/** Клинок и лёгкие слоты сильнее влияют на крит */
const SLOT_CRIT_BIAS: Record<GearSlot, number> = {
  head: 0.78,
  sword: 1.38,
  shield: 0.42,
  shoulders: 0.72,
  chest: 0.62,
};

export type ItemCombatStats = {
  attack: number;
  defense: number;
  /** Вклад в шанс крита (0..1), до суммирования и капа экипировки */
  critChance: number;
};

export type CombatStats = {
  attack: number;
  defense: number;
  /** Сумма крита с надетых вещей после капа CRIT_FROM_GEAR_CAP */
  critFromGear: number;
};

/**
 * Статы одной вещи по слоту и редкости (то же правило, что и в сумме экипировки).
 */
export function computeItemCombatStats(item: GearItem): ItemCombatStats {
  const base = RARITY_BASE[item.rarity];
  const bias = SLOT_BIAS[item.slot];
  const attack = Math.max(1, Math.round(base.atk * bias.atk));
  const defense = Math.max(1, Math.round(base.def * bias.def));
  const critChance = RARITY_CRIT_BASE[item.rarity] * SLOT_CRIT_BIAS[item.slot];
  return { attack, defense, critChance };
}

/**
 * Суммирует вклад всех надетых вещей (5 слотов).
 */
export function computeCombatStats(equipped: Record<GearSlot, GearItem | null>): CombatStats {
  let attack = 0;
  let defense = 0;
  let critSum = 0;

  for (const slot of Object.keys(SLOT_BIAS) as GearSlot[]) {
    const item = equipped[slot];
    if (!item) continue;
    const s = computeItemCombatStats(item);
    attack += s.attack;
    defense += s.defense;
    critSum += s.critChance;
  }

  const critFromGear = Math.min(CRIT_FROM_GEAR_CAP, critSum);

  return { attack, defense, critFromGear };
}
