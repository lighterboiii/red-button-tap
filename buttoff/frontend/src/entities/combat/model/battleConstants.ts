/** Шанс за тап получить +к к криту */
export const CRIT_TAP_PROC_CHANCE = 0.14;
/** Добавка к шансу крита за одно срабатывание (0.01 = 1%) */
export const CRIT_TAP_DELTA = 0.012;
/** Потолок крита с тапов (не считая боя) */
export const CRIT_FROM_TAPS_CAP = 0.38;

/** Потолок суммы крита только с надетых вещей */
export const CRIT_FROM_GEAR_CAP = 0.22;
/** Итоговый шанс крита в бою: экипировка + тапы */
export const TOTAL_CRIT_CAP = 0.52;

/** Базовые HP игрока до брони */
export const PLAYER_HP_BASE = 42;
/** Каждая единица защиты даёт HP */
export const PLAYER_HP_PER_DEFENSE = 2;

/** Лимит раундов */
export const BATTLE_MAX_ROUNDS = 10;
