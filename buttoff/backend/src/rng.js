import { RARITY_WEIGHTS, POOLS } from './outcomes.js';

function pickRarity() {
  const r = Math.random();
  let acc = 0;
  const entries = Object.entries(RARITY_WEIGHTS);
  for (const [rarity, w] of entries) {
    acc += w;
    if (r <= acc) return /** @type {keyof typeof RARITY_WEIGHTS} */ (rarity);
  }
  return 'common';
}

function pickFromPool(rarity) {
  const pool = POOLS[rarity];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Один «тап» — одна выпавшая редкость + карточка из пула. */
export function rollTap() {
  const rarity = pickRarity();
  const card = pickFromPool(rarity);
  const weight = RARITY_WEIGHTS[rarity];
  return {
    ...card,
    rarity,
    /** Доля 0–1 для отображения «~X%» */
    approximateChance: weight,
  };
}
