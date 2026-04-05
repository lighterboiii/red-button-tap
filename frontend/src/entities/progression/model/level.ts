/**
 * Прогрессия: числа должны совпадать с backend `combat/progression.js` (HP)
 * и логикой XP ниже.
 */

export const PLAYER_HP_BASE = 12;
export const PLAYER_HP_PER_LEVEL = 4;

export const XP_PER_TAP = 1;
/** Сколько XP за сутки можно получить только с тапов (анти-фарм) */
export const XP_TAP_DAILY_CAP = 15;

export const XP_WIN_RANDOM = 12;
export const XP_WIN_SPAR = 5;
export const XP_LOSS = 3;

export const MAX_LEVEL = 99;

export function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return 1;
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
}

/** HP в бою: 12 на 1-м уровне, +4 за каждый следующий */
export function playerMaxHpFromLevel(level: number): number {
  const L = clampLevel(level);
  return PLAYER_HP_BASE + (L - 1) * PLAYER_HP_PER_LEVEL;
}

/** Опыт до следующего уровня (на текущем уровне L нужно набрать xp от 0 до этого значения) */
export function xpToNextLevel(level: number): number {
  const L = clampLevel(level);
  if (L >= MAX_LEVEL) return Infinity;
  return 100 + (L - 1) * 50;
}

export function grantXp(state: { level: number; xp: number }, amount: number): { level: number; xp: number } {
  let level = clampLevel(state.level);
  let xp = Math.max(0, Math.floor(state.xp));
  let add = Math.max(0, amount);
  while (add > 0 && level < MAX_LEVEL) {
    const need = xpToNextLevel(level);
    const space = need - xp;
    if (add <= space) {
      xp += add;
      add = 0;
    } else {
      add -= space;
      level += 1;
      xp = 0;
    }
  }
  if (level >= MAX_LEVEL) {
    return { level: MAX_LEVEL, xp: 0 };
  }
  return { level, xp };
}
