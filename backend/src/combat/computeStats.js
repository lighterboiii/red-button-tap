import { CRIT_FROM_GEAR_CAP } from './constants.js';
import { getCatalogEntry } from '../itemCatalog.js';

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
  jewelry: { atk: 0.15, def: 0.15 },
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
  jewelry: 1.0,
};

const CORE_SLOTS = ['head', 'sword', 'shield', 'shoulders', 'chest'];
const ALL_SLOTS = [...CORE_SLOTS, 'jewelry'];

function baseStatsFromRaritySlot(rarity, slot) {
  const base = RARITY_BASE[rarity];
  const bias = SLOT_BIAS[slot];
  const attack = Math.max(1, Math.round(base.atk * bias.atk));
  const defense = Math.max(1, Math.round(base.def * bias.def));
  const critChance = RARITY_CRIT_BASE[rarity] * SLOT_CRIT_BIAS[slot];
  return { attack, defense, critChance };
}

/**
 * @param {{ id: string, slot: string, rarity: string, label?: string, catalogId?: string }} item
 */
export function computeItemCombatStats(item) {
  if (item.catalogId) {
    const cat = getCatalogEntry(item.catalogId);
    if (cat) {
      const base = baseStatsFromRaritySlot(cat.rarity, cat.slot);
      return {
        attack: Math.max(1, base.attack + cat.atkDelta),
        defense: Math.max(1, base.defense + cat.defDelta),
        critChance: Math.max(0, base.critChance + cat.critDelta),
      };
    }
  }
  const rarity = item.rarity;
  const slot = item.slot;
  if (!RARITY_BASE[rarity] || !SLOT_BIAS[slot]) {
    return { attack: 1, defense: 1, critChance: 0.01 };
  }
  return baseStatsFromRaritySlot(rarity, slot);
}

/**
 * Эффекты бижутерии для боя (не более одного кольца в слоте).
 * @param {{ id: string, slot: string, rarity: string, catalogId?: string } | null} item
 */
function jewelryBattleModifiers(item) {
  if (!item || item.slot !== 'jewelry' || !item.catalogId) {
    return {
      mercyChance: 0,
      critFlat: 0,
      triad: false,
      blockChance: 0,
    };
  }
  const cat = getCatalogEntry(item.catalogId);
  if (!cat || !cat.effect) {
    return { mercyChance: 0, critFlat: 0, triad: false, blockChance: 0 };
  }
  switch (cat.effect) {
    case 'mercy':
      return { mercyChance: 0.025, critFlat: 0, triad: false, blockChance: 0 };
    case 'crit_surge':
      return { mercyChance: 0, critFlat: 0.25, triad: false, blockChance: 0 };
    case 'triad':
      return { mercyChance: 0, critFlat: 0, triad: true, blockChance: 0 };
    case 'aegis':
      return { mercyChance: 0, critFlat: 0, triad: false, blockChance: 0.22 };
    default:
      return { mercyChance: 0, critFlat: 0, triad: false, blockChance: 0 };
  }
}

/**
 * @param {Record<string, { id: string, slot: string, rarity: string, catalogId?: string } | null>} equipped
 */
export function computeCombatStats(equipped) {
  let attack = 0;
  let defense = 0;
  let critSum = 0;

  for (const slot of CORE_SLOTS) {
    const item = equipped[slot];
    if (!item) continue;
    const s = computeItemCombatStats(item);
    attack += s.attack;
    defense += s.defense;
    critSum += s.critChance;
  }

  const jewelry = equipped.jewelry;
  if (jewelry) {
    const s = computeItemCombatStats(jewelry);
    attack += s.attack;
    defense += s.defense;
    critSum += s.critChance;
  }

  const critFromGear = Math.min(CRIT_FROM_GEAR_CAP, critSum);
  const j = jewelryBattleModifiers(jewelry);

  return {
    attack,
    defense,
    critFromGear,
    jewelryMercyChance: j.mercyChance,
    jewelryCritFlat: j.critFlat,
    jewelryTriad: j.triad,
    jewelryBlockChance: j.blockChance,
  };
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
