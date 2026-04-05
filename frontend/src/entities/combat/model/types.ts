export type EnemyProfile = {
  name: string;
  hp: number;
  attack: number;
  defense: number;
};

/** Кусок строки журнала для раскраски чисел */
export type BattleLogFragment =
  | { type: 'plain'; text: string }
  | { type: 'damage'; value: number }
  | { type: 'block'; value: number }
  | { type: 'hp'; value: number };

export type BattleRoundLine = {
  round: number;
  /** Кто инициатор строки: твой ход / ответ врага / итог раунда */
  side?: 'player' | 'enemy' | 'neutral';
  /** Плоский текст (копирование, aria, старые клиенты) */
  text: string;
  /** Разметка для UI; если нет — показываем только text */
  fragments?: BattleLogFragment[];
};

export type BattleKind = 'random' | 'spar';

export type BattleOutcome = {
  won: boolean;
  rounds: BattleRoundLine[];
  playerHpStart: number;
  playerHpEnd: number;
  enemyHpStart: number;
  enemyHpEnd: number;
  enemy: EnemyProfile;
  battleKind: BattleKind;
};

export type ItemCombatStats = {
  attack: number;
  defense: number;
  critChance: number;
};

export type CombatStats = {
  attack: number;
  defense: number;
  critFromGear: number;
};

/** Ответ POST /api/combat/preview */
export type CombatPreviewResponse = {
  combatStats: CombatStats;
  totalCritChance: number;
  itemStatsById: Record<string, ItemCombatStats>;
};

/** Ответ POST /api/battle/opponent */
export type BattleOpponentResponse = {
  enemy: EnemyProfile;
  playerHp: number;
  level?: number;
};

/** Экран «встреча» перед боем */
export type BattleIntroState = {
  battleKind: BattleKind;
  enemy: EnemyProfile;
  playerHp: number;
};
