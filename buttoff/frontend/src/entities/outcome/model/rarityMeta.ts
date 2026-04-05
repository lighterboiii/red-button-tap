import type { Rarity } from './rarity';

/** Для UI: цвет и подпись — игрок видит, что «верх» редкий. */
export const RARITY_META: Record<
  Rarity,
  { title: string; hint: string }
> = {
  common: { title: '', hint: '' },
  uncommon: { title: 'Необычное', hint: 'Выпало обычное' },
  rare: { title: 'Редкое', hint: 'Редкое, поздравляем!' },
  legendary: { title: 'Легендарное', hint: 'Ты нашёл легенду!' },
};
