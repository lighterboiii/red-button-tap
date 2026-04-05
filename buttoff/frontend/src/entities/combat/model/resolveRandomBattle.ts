import {
  BATTLE_MAX_ROUNDS,
  PLAYER_HP_BASE,
  PLAYER_HP_PER_DEFENSE,
  TOTAL_CRIT_CAP,
} from './battleConstants';
import type { CombatStats } from './computeCombatStats';

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

export type BattleOutcome = {
  won: boolean;
  rounds: BattleRoundLine[];
  playerHpStart: number;
  playerHpEnd: number;
  enemyHpStart: number;
  enemyHpEnd: number;
  enemy: EnemyProfile;
};

function rollEnemy(): EnemyProfile {
  const templates = [
    { name: 'Гоблин-разведчик', hp: 28, attack: 9, defense: 4 },
    { name: 'Скелет-воин', hp: 36, attack: 11, defense: 6 },
    { name: 'Орк-налётчик', hp: 44, attack: 14, defense: 5 },
    { name: 'Тёмный рыцарь', hp: 52, attack: 13, defense: 10 },
    { name: 'Демон-бес', hp: 40, attack: 16, defense: 7 },
  ] as const;
  return { ...templates[Math.floor(Math.random() * templates.length)] };
}

function rngFactor(): number {
  return 0.88 + Math.random() * 0.24;
}

/**
 * Пошаговый бой: игрок и враг бьют по очереди, крит только у игрока.
 */
export function resolveRandomBattle(
  stats: CombatStats,
  critChanceFromTaps: number,
): BattleOutcome {
  const enemy = rollEnemy();
  let playerHp = PLAYER_HP_BASE + stats.defense * PLAYER_HP_PER_DEFENSE;
  let enemyHp = enemy.hp;
  const rounds: BattleRoundLine[] = [];

  const critChanceTotal = Math.min(TOTAL_CRIT_CAP, stats.critFromGear + critChanceFromTaps);

  const playerHpStart = playerHp;
  const enemyHpStart = enemy.hp;

  let round = 0;
  while (round < BATTLE_MAX_ROUNDS && playerHp > 0 && enemyHp > 0) {
    round += 1;

    const crit = Math.random() < critChanceTotal;
    const raw = stats.attack * rngFactor();
    const mitigated = enemy.defense * 0.35;
    let dmg = Math.max(1, Math.floor(raw * (crit ? 2 : 1) - mitigated));
    dmg = Math.min(dmg, enemyHp);
    enemyHp -= dmg;
    rounds.push({
      round,
      text: crit
        ? `Крит! Ты бьёшь на ${dmg} (враг ${enemyHp <= 0 ? 0 : enemyHp} HP).`
        : `Удар на ${dmg} (враг ${enemyHp <= 0 ? 0 : enemyHp} HP).`,
    });

    if (enemyHp <= 0) {
      return {
        won: true,
        rounds,
        playerHpStart,
        playerHpEnd: playerHp,
        enemyHpStart,
        enemyHpEnd: 0,
        enemy,
      };
    }

    const rawE = enemy.attack * rngFactor();
    const mitE = stats.defense * 0.38;
    let dmgE = Math.max(1, Math.floor(rawE - mitE));
    dmgE = Math.min(dmgE, playerHp);
    playerHp -= dmgE;
    rounds.push({
      round,
      text: `Ответ: ${dmgE} урона (у тебя ${playerHp <= 0 ? 0 : playerHp} HP).`,
    });

    if (playerHp <= 0) {
      return {
        won: false,
        rounds,
        playerHpStart,
        playerHpEnd: 0,
        enemyHpStart,
        enemyHpEnd: enemyHp,
        enemy,
      };
    }
  }

  /** Ничья по лимиту раундов — по оставшемуся HP */
  const won = playerHp > enemyHp;
  rounds.push({
    round: round + 1,
    text: won ? 'Враг отступает.' : 'Ты на пределе — отход.',
  });

  return {
    won,
    rounds,
    playerHpStart,
    playerHpEnd: Math.max(0, playerHp),
    enemyHpStart,
    enemyHpEnd: Math.max(0, enemyHp),
    enemy,
  };
}
