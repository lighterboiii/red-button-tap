export {
  computeCombatStats,
  computeItemCombatStats,
  type CombatStats,
  type ItemCombatStats,
} from './model/computeCombatStats';
export {
  CRIT_FROM_GEAR_CAP,
  CRIT_FROM_TAPS_CAP,
  CRIT_TAP_DELTA,
  CRIT_TAP_PROC_CHANCE,
  TOTAL_CRIT_CAP,
} from './model/battleConstants';
export {
  resolveRandomBattle,
  type BattleOutcome,
  type BattleRoundLine,
  type EnemyProfile,
} from './model/resolveRandomBattle';
