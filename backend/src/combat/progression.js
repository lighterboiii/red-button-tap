/**
 * Единственный источник правды: HP, уровень, опыт, лимиты тапов.
 * Клиент только отображает и шлёт снимок; пересчёт — здесь.
 */

export const PLAYER_HP_BASE = 12;
export const PLAYER_HP_PER_LEVEL = 4;

export const MIN_PLAYER_LEVEL = 1;
export const MAX_PLAYER_LEVEL = 99;

export const XP_PER_TAP = 1;
export const XP_TAP_DAILY_CAP = 15;

export const XP_WIN_RANDOM = 12;
export const XP_WIN_SPAR = 5;
export const XP_LOSS = 3;

export function serverDayKey() {
  return new Date().toISOString().slice(0, 10);
}

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

export function xpToNextLevel(level) {
  const L = clampPlayerLevel(level);
  if (L >= MAX_PLAYER_LEVEL) return Infinity;
  const linear = 70 + 50 * L;
  const curve = 15 * (L - 1) * (L - 1);
  return linear + curve;
}

function grantXpInner(level, xp, amount) {
  let L = clampPlayerLevel(level);
  let x = Math.max(0, Math.floor(Number(xp) || 0));
  let add = Math.max(0, amount);
  while (add > 0 && L < MAX_PLAYER_LEVEL) {
    const need = xpToNextLevel(L);
    if (!Number.isFinite(need)) break;
    const space = need - x;
    if (add <= space) {
      x += add;
      add = 0;
    } else {
      add -= space;
      L += 1;
      x = 0;
    }
  }
  if (L >= MAX_PLAYER_LEVEL) {
    return { level: MAX_PLAYER_LEVEL, xp: 0 };
  }
  return { level: L, xp: x };
}

/** Сброс дневного счётчика тап-XP, если день на клиенте не совпал с сервером */
export function parseProgression(raw) {
  const serverD = serverDayKey();
  let level = clampPlayerLevel(raw?.level);
  let xp = Math.max(0, Math.floor(Number(raw?.xp) || 0));
  let tapXpDay = Math.min(XP_TAP_DAILY_CAP, Math.max(0, Math.floor(Number(raw?.tapXpDay) || 0)));
  const clientDay = typeof raw?.dayKey === 'string' ? raw.dayKey : null;
  if (clientDay != null && clientDay !== serverD) {
    tapXpDay = 0;
  }
  let p = { level, xp, tapXpDay, dayKey: serverD };
  while (p.level < MAX_PLAYER_LEVEL && p.xp >= xpToNextLevel(p.level)) {
    p.xp -= xpToNextLevel(p.level);
    p.level += 1;
  }
  if (p.level >= MAX_PLAYER_LEVEL) {
    return { level: MAX_PLAYER_LEVEL, xp: 0, tapXpDay: p.tapXpDay, dayKey: p.dayKey };
  }
  return p;
}

export function applyTapTakeXp(progressionRaw) {
  const p = parseProgression(progressionRaw);
  if (p.tapXpDay >= XP_TAP_DAILY_CAP) {
    return { ...p };
  }
  const g = grantXpInner(p.level, p.xp, XP_PER_TAP);
  return {
    level: g.level,
    xp: g.xp,
    tapXpDay: p.tapXpDay + XP_PER_TAP,
    dayKey: p.dayKey,
  };
}

export function applyBattleXp(progressionRaw, won, battleKind) {
  const p = parseProgression(progressionRaw);
  const gain = won ? (battleKind === 'random' ? XP_WIN_RANDOM : XP_WIN_SPAR) : XP_LOSS;
  const g = grantXpInner(p.level, p.xp, gain);
  return {
    level: g.level,
    xp: g.xp,
    tapXpDay: p.tapXpDay,
    dayKey: p.dayKey,
  };
}

export function progressionSnapshot(p) {
  const level = clampPlayerLevel(p.level);
  const need = xpToNextLevel(level);
  const xpToNext = level >= MAX_PLAYER_LEVEL ? 0 : need;
  return {
    progression: {
      level: p.level,
      xp: p.xp,
      tapXpDay: p.tapXpDay,
      dayKey: p.dayKey,
    },
    xpToNext,
    playerMaxHp: playerMaxHpFromLevel(level),
  };
}

export function progressionFromRequestBody(body) {
  if (body?.progression && typeof body.progression === 'object') {
    return parseProgression(body.progression);
  }
  return parseProgression({
    level: body?.level,
    xp: 0,
    tapXpDay: 0,
    dayKey: serverDayKey(),
  });
}
