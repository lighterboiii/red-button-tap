/** Снимок прогрессии с сервера — пересчёты только на бэкенде */

export type PlayerProgressionPayload = {
  level: number;
  xp: number;
  tapXpDay: number;
  dayKey: string;
};

export type ProgressionSnapshot = {
  progression: PlayerProgressionPayload;
  /** Опыт до следующего уровня; 0 = макс. уровень */
  xpToNext: number;
  playerMaxHp: number;
};

/** Только отображение / лимиты в UI; формулы на бэкенде */
export const MAX_LEVEL = 99;
