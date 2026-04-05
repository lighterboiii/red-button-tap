import type { Rarity } from './rarity';

/** Только ярус редкости; без лишних подсказок */
export const RARITY_META: Record<Rarity, { title: string; hint: string }> = {
  common: { title: 'Обычное', hint: '' },
  uncommon: { title: 'Необычное', hint: '' },
  rare: { title: 'Редкое', hint: '' },
  legendary: { title: 'Легендарное', hint: '' },
};
