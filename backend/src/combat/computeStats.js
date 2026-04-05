import { CRIT_FROM_GEAR_CAP } from './constants.js';

const RARITY_BASE = {
  common: { atk: 3, def: 3 },
  uncommon: { atk: 6, def: 5 },
  rare: { atk: 10, def: 8 },
  legendary: { atk: 16, def: 12 },
};

const SLOT_BIAS = {
  head: { atk: 0.35, def: 0.65 },
  sword: { atk: 1.25, def: 0.35 },
  shield: { atk: 0.25, def: 1.2 },
  shoulders: { atk: 0.55, def: 0.75 },
  chest: { atk: 0.4, def: 1.0 },
};

const RARITY_CRIT_BASE = {
  common: 0.016,
  uncommon: 0.024,
  rare: 0.032,
  legendary: 0.042,
};

const SLOT_CRIT_BIAS = {
  head: 0.78,
  sword: 1.38,
  shield: 0.42,
  shoulders: 0.72,
  chest: 0.62,
};

const SLOTS = ['head', 'sword', 'shield', 'shoulders', 'chest'];

export function computeItemCombatStats(item) {
  const base = RARITY_BASE[item.rarity];
  const bias = SLOT_BIAS[item.slot];
  const attack = Math.max(1, Math.round(base.atk * bias.atk));
  const defense = Math.max(1, Math.round(base.def * bias.def));
  const critChance = RARITY_CRIT_BASE[item.rarity] * SLOT_CRIT_BIAS[item.slot];
  return { attack, defense, critChance };
}

export function computeCombatStats(equipped) {
  let attack = 0;
  let defense = 0;
  let critSum = 0;
  for (const slot of SLOTS) {
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

/** Сводка по списку предметов (инвентарь + можно надетые) по id */
export function computeItemStatsMap(items) {
  const out = {};
  if (!Array.isArray(items)) return out;
  for (const item of items) {
    if (item && typeof item.id === 'string') {
      out[item.id] = computeItemCombatStats(item);
    }
  }
  return out;
}
