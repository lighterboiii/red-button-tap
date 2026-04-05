/** @typedef {'common' | 'uncommon' | 'rare' | 'legendary'} Rarity */

/** Шансы по редкости (сумма = 1). Тексты карточек не показываются — в ответе только дроп. */
export const RARITY_WEIGHTS = {
  common: 0.72,
  uncommon: 0.2,
  rare: 0.065,
  legendary: 0.015,
};

/** Пулы id для rng; подписи не используются в API (подменяются в index на имя вещи). */
export const POOLS = {
  common: [
    { id: 'c1', label: '', message: '' },
    { id: 'c2', label: '', message: '' },
    { id: 'c3', label: '', message: '' },
  ],
  uncommon: [
    { id: 'u1', label: '', message: '' },
    { id: 'u2', label: '', message: '' },
  ],
  rare: [
    { id: 'r1', label: '', message: '' },
    { id: 'r2', label: '', message: '' },
  ],
  legendary: [{ id: 'l1', label: '', message: '' }],
};
