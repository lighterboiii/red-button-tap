/**
 * HP и уровень игрока. Числа должны совпадать с frontend `entities/progression`.
 * HP не зависит от защиты — только от уровня.
 */

export const PLAYER_HP_BASE = 12;
export const PLAYER_HP_PER_LEVEL = 4;

export const MIN_PLAYER_LEVEL = 1;
export const MAX_PLAYER_LEVEL = 99;

export function clampPlayerLevel(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return MIN_PLAYER_LEVEL;
  const L = Math.trunc(n);
  return Math.min(MAX_PLAYER_LEVEL, Math.max(MIN_PLAYER_LEVEL, L));
}

export function playerMaxHpFromLevel(level) {
  const L = clampPlayerLevel(level);
  return PLAYER_HP_BASE + (L - 1) * PLAYER_HP_PER_LEVEL;
}
