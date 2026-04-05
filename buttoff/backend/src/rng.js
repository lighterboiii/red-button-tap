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

/** common: c1/c2 чаще, «тишина» c3 — реже. */
function pickCommonCard() {
  const [c1, c2, c3] = POOLS.common;
  const r = Math.random();
  if (r < 0.42) return c1;
  if (r < 0.84) return c2;
  return c3;
}

function pickFromPool(rarity) {
  if (rarity === 'common') return pickCommonCard();
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
