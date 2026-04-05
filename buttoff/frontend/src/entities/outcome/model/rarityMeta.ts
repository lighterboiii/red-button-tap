import type { Rarity } from './types';

/** Для UI: цвет и подпись — игрок видит, что «верх» редкий. */
export const RARITY_META: Record<
  Rarity,
  { title: string; hint: string }
> = {
  common: { title: 'Обычное', hint: 'Чаще всего — без сюрприза, так и задумано.' },
  uncommon: { title: 'Необычное', hint: 'Попадается иногда — маленький плюс.' },
  rare: { title: 'Редкое', hint: 'Редко. Если выпало — ты заметил.' },
  legendary: { title: 'Легендарное', hint: 'Очень редко. Шанс копеечный.' },
};
