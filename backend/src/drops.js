import {
  armorIdsForRarity,
  getCatalogEntry,
  JEWELRY_IDS,
} from './itemCatalog.js';

/** Слоты экипировки (совпадают с фронтом). Бижутерия — отдельный слот. */
export const GEAR_SLOTS = /** @type {const} */ ([
  'head',
  'sword',
  'shield',
  'chest',
  'jewelry',
  'shoulders',
]);

/** Слоты, обязательные для боя (без бижутерии). */
export const CORE_GEAR_SLOTS = /** @type {const} */ ([
  'head',
  'sword',
  'shield',
  'chest',
  'shoulders',
]);

/** @typedef {typeof GEAR_SLOTS[number]} GearSlot */

/** Подписи слота для UI (стиль RPG). */
export const SLOT_LABEL_RU = {
  head: 'Шлем',
  sword: 'Оружие',
  shield: 'Щит',
  shoulders: 'Наплечники',
  chest: 'Нагрудник',
  jewelry: 'Бижутерия',
};

/** @typedef {'common' | 'uncommon' | 'rare' | 'legendary'} Rarity */

/**
 * Случайный дроп из каталога по редкости (броня).
 * @param {Rarity} rarity
 * @returns {{ slot: GearSlot, label: string, catalogId: string }}
 */
export function rollDrop(rarity) {
  const pool = armorIdsForRarity(rarity);
  const id = pool[Math.floor(Math.random() * pool.length)];
  const entry = getCatalogEntry(id);
  if (!entry) {
    const slot = CORE_GEAR_SLOTS[Math.floor(Math.random() * CORE_GEAR_SLOTS.length)];
    return { slot, label: 'Неизвестная вещь', catalogId: 'cm_h1' };
  }
  return { slot: entry.slot, label: entry.label, catalogId: entry.id };
}

/**
 * Случайная бижутерия из четырёх легендарных.
 * @returns {{ slot: 'jewelry', label: string, catalogId: string }}
 */
export function rollJewelryDrop() {
  const id = JEWELRY_IDS[Math.floor(Math.random() * JEWELRY_IDS.length)];
  const entry = getCatalogEntry(id);
  if (!entry) {
    return { slot: 'jewelry', label: 'Кольцо веков', catalogId: 'jw_crit' };
  }
  return { slot: 'jewelry', label: entry.label, catalogId: entry.id };
}
