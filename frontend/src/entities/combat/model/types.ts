export type EnemyProfile = {
  name: string;
  hp: number;
  attack: number;
  defense: number;
};

export type BattleRoundLine = {
  round: number;
  text: string;
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
};

/** Экран «встреча» перед боем */
export type BattleIntroState = {
  battleKind: BattleKind;
  enemy: EnemyProfile;
  playerHp: number;
};
