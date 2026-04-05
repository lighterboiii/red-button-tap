/** @typedef {'common' | 'uncommon' | 'rare' | 'legendary'} Rarity */

/**
 * Шансы по редкости брони (сумма ≈ 1 за вычетом бижутерии).
 * Легендарная броня — очень редко; бижутерия — отдельный крошечный бросок в rng.
 */
export const RARITY_WEIGHTS = {
  common: 0.56,
  uncommon: 0.28,
  rare: 0.083,
  legendary: 0.0295,
};

/** Вероятность отдельного броска «выпала бижутерия» (1 из 4 легендарных аксессуаров). */
export const JEWELRY_DROP_WEIGHT = 0.0008;
