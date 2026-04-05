import {
  BATTLE_SWING_MAX,
  BATTLE_SWING_MIN,
  ENEMY_HIT_PLAYER_DEFENSE_FACTOR,
  PLAYER_CRIT_DAMAGE_MULTIPLIER,
  PLAYER_HIT_ENEMY_DEFENSE_FACTOR,
} from './constants.js';

export function rollSwingMultiplier() {
  return BATTLE_SWING_MIN + Math.random() * (BATTLE_SWING_MAX - BATTLE_SWING_MIN);
}

export function computePlayerStrikeDamage(playerAttack, enemyDefense, enemyHpLeft, crit, swing) {
  const rawBeforeCrit = playerAttack * swing;
  const powerAfterCrit = rawBeforeCrit * (crit ? PLAYER_CRIT_DAMAGE_MULTIPLIER : 1);
  const armorFromEnemyDefense = enemyDefense * PLAYER_HIT_ENEMY_DEFENSE_FACTOR;
  let dmg = Math.max(1, Math.floor(powerAfterCrit - armorFromEnemyDefense));
  dmg = Math.min(dmg, enemyHpLeft);
  return {
    dmg,
    rawBeforeCrit,
    powerAfterCrit,
    armorFromEnemyDefense,
    crit,
    swing,
  };
}

export function computeEnemyStrikeDamage(enemyAttack, playerDefense, playerHpLeft, swing) {
  const rawPower = enemyAttack * swing;
  const armorFromPlayerDefense = playerDefense * ENEMY_HIT_PLAYER_DEFENSE_FACTOR;
  let dmg = Math.max(1, Math.floor(rawPower - armorFromPlayerDefense));
  dmg = Math.min(dmg, playerHpLeft);
  return { dmg, rawPower, armorFromPlayerDefense, swing };
}
