import { JEWELRY_DROP_WEIGHT, RARITY_WEIGHTS } from './outcomes.js';
import { rollDrop, rollJewelryDrop } from './drops.js';

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

function newTapId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Один тап — редкость, дроп из каталога; редко выпадает бижутерия. */
export function rollTap() {
  if (Math.random() < JEWELRY_DROP_WEIGHT) {
    const drop = rollJewelryDrop();
    return {
      id: newTapId('jw'),
      rarity: /** @type {'legendary'} */ ('legendary'),
      approximateChance: JEWELRY_DROP_WEIGHT,
      drop,
      isJewelry: true,
    };
  }

  const rarity = pickRarity();
  const drop = rollDrop(rarity);
  const weight = RARITY_WEIGHTS[rarity];
  return {
    id: newTapId(rarity),
    rarity,
    approximateChance: weight,
    drop,
    isJewelry: false,
  };
}
