import { BATTLE_MAX_ROUNDS, TOTAL_CRIT_CAP } from './constants.js';
import { computeEnemyStrikeDamage, computePlayerStrikeDamage, rollSwingMultiplier } from './formulas.js';

export const SPAR_OPPONENT = {
  name: 'Стальной манекен «Песочник»',
  hp: 34,
  attack: 8,
  defense: 5,
};

/** Шаблоны случайных врагов — для броска и проверки тела запроса */
export const RANDOM_ENEMY_TEMPLATES = [
  { name: 'Гоблин-разведчик', hp: 28, attack: 9, defense: 4 },
  { name: 'Скелет-воин', hp: 36, attack: 11, defense: 6 },
  { name: 'Орк-налётчик', hp: 44, attack: 14, defense: 5 },
  { name: 'Тёмный рыцарь', hp: 52, attack: 13, defense: 10 },
  { name: 'Демон-бес', hp: 40, attack: 16, defense: 7 },
];

export function rollEnemy() {
  const i = Math.floor(Math.random() * RANDOM_ENEMY_TEMPLATES.length);
  return { ...RANDOM_ENEMY_TEMPLATES[i] };
}

export function isValidRandomEnemy(e) {
  if (!e || typeof e !== 'object') return false;
  return RANDOM_ENEMY_TEMPLATES.some(
    (t) =>
      t.name === e.name && t.hp === e.hp && t.attack === e.attack && t.defense === e.defense,
  );
}

export function isSparEnemy(e) {
  if (!e || typeof e !== 'object') return false;
  return (
    e.name === SPAR_OPPONENT.name &&
    e.hp === SPAR_OPPONENT.hp &&
    e.attack === SPAR_OPPONENT.attack &&
    e.defense === SPAR_OPPONENT.defense
  );
}

function fragmentsToText(fragments) {
  return fragments
    .map((f) => {
      if (f.type === 'plain') return f.text;
      return String(f.value);
    })
    .join('');
}

/** Удар игрока — стиль журнала «Герои ММ», без лишних формул */
function buildPlayerHitLine(m, enemyHpAfter, spar) {
  const arm = Math.round(m.armorFromEnemyDefense);
  const fragments = [];
  if (m.crit) {
    fragments.push({ type: 'plain', text: 'Критический удар! ' });
  }
  if (spar) {
    fragments.push(
      { type: 'plain', text: 'Ты наносишь манекену ' },
      { type: 'damage', value: m.dmg },
      { type: 'plain', text: ' урона. Манекен отбивает ' },
      { type: 'block', value: arm },
      { type: 'plain', text: '. У манекена остаётся ' },
      { type: 'hp', value: enemyHpAfter },
      { type: 'plain', text: ' HP.' },
    );
  } else {
    fragments.push(
      { type: 'plain', text: 'Ты наносишь ' },
      { type: 'damage', value: m.dmg },
      { type: 'plain', text: ' урона. Вражеская броня поглощает ' },
      { type: 'block', value: arm },
      { type: 'plain', text: '. У противника остаётся ' },
      { type: 'hp', value: enemyHpAfter },
      { type: 'plain', text: ' HP.' },
    );
  }
  return { side: 'player', fragments, text: fragmentsToText(fragments) };
}

function buildEnemyHitLine(m, enemy, playerHpAfter, spar, blocked) {
  const arm = Math.round(m.armorFromPlayerDefense);
  const name = spar ? 'Манекен' : enemy.name;
  if (blocked) {
    const fragments = [
      { type: 'plain', text: `${name} бьёт, но бижутерия полностью отводит удар — ` },
      { type: 'damage', value: 0 },
      { type: 'plain', text: ` урона. У тебя остаётся ` },
      { type: 'hp', value: playerHpAfter },
      { type: 'plain', text: ' HP.' },
    ];
    return { side: 'enemy', fragments, text: fragmentsToText(fragments) };
  }
  const fragments = [
    { type: 'plain', text: `${name} наносит тебе ` },
    { type: 'damage', value: m.dmg },
    { type: 'plain', text: ' урона. Твоя броня поглощает ' },
    { type: 'block', value: arm },
    { type: 'plain', text: '. У тебя остаётся ' },
    { type: 'hp', value: playerHpAfter },
    { type: 'plain', text: ' HP.' },
  ];
  return { side: 'enemy', fragments, text: fragmentsToText(fragments) };
}

/**
 * @param {object} stats — из computeCombatStats; доп. поля jewelry*
 * @param {number} critChanceFromTaps
 */
function resolveBattleCore(stats, critChanceFromTaps, enemy, battleKind, playerMaxHp) {
  let playerHp = playerMaxHp;
  let enemyHp = enemy.hp;
  const rounds = [];

  const mercyChance = stats.jewelryMercyChance ?? 0;
  const critFlat = stats.jewelryCritFlat ?? 0;
  const triad = Boolean(stats.jewelryTriad);
  const blockChance = stats.jewelryBlockChance ?? 0;

  const critChanceTotal = Math.min(
    TOTAL_CRIT_CAP,
    stats.critFromGear + critChanceFromTaps + critFlat,
  );

  const playerHpStart = playerHp;
  const enemyHpStart = enemy.hp;

  const spar = battleKind === 'spar';

  /** Сердце эха заката — редкая мгновенная победа */
  if (mercyChance > 0 && Math.random() < mercyChance) {
    const winText = spar
      ? 'Сердце эха заката сжимается — и манекен рассыпается прахом по сигналу судьбы.'
      : 'Сердце эха заката сияет: судьба вручает тебе победу, пока враг ещё не успел идти.';

    rounds.push({
      round: 1,
      side: 'neutral',
      text: winText,
      fragments: [{ type: 'plain', text: winText }],
    });

    return {
      won: true,
      rounds,
      playerHpStart,
      playerHpEnd: playerHp,
      enemyHpStart,
      enemyHpEnd: 0,
      enemy,
      battleKind,
    };
  }

  let round = 0;
  while (round < BATTLE_MAX_ROUNDS && playerHp > 0 && enemyHp > 0) {
    round += 1;

    const playerHits = triad ? 3 : 1;
    for (let h = 0; h < playerHits && enemyHp > 0; h += 1) {
      const crit = Math.random() < critChanceTotal;
      const swingP = rollSwingMultiplier();
      const ps = computePlayerStrikeDamage(stats.attack, enemy.defense, enemyHp, crit, swingP);
      enemyHp -= ps.dmg;

      const pl = buildPlayerHitLine(ps, enemyHp <= 0 ? 0 : enemyHp, spar);
      rounds.push({
        round,
        side: pl.side,
        text: triad && playerHits > 1 ? `${pl.text} (${h + 1}/${playerHits})` : pl.text,
        fragments: pl.fragments,
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
          battleKind,
        };
      }
    }

    const swingE = rollSwingMultiplier();
    const es = computeEnemyStrikeDamage(enemy.attack, stats.defense, playerHp, swingE);
    const blocked = blockChance > 0 && Math.random() < blockChance;
    const dmg = blocked ? 0 : es.dmg;
    playerHp -= dmg;

    const el = buildEnemyHitLine(es, enemy, playerHp <= 0 ? 0 : playerHp, spar, blocked);
    rounds.push({
      round,
      side: el.side,
      text: el.text,
      fragments: el.fragments,
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
        battleKind,
      };
    }
  }

  const won = playerHp > enemyHp;
  const endText = spar
    ? won
      ? 'Сигнал тренера — стоп, манекен «отключён».'
      : 'Перерыв: манекен ещё стоит — можно подлечиться и зайти снова.'
    : won
      ? 'Враг отступает с поля боя.'
      : 'Ты отступаешь — бой окончен.';
  rounds.push({
    round: round + 1,
    side: 'neutral',
    text: endText,
    fragments: [{ type: 'plain', text: endText }],
  });

  return {
    won,
    rounds,
    playerHpStart,
    playerHpEnd: Math.max(0, playerHp),
    enemyHpStart,
    enemyHpEnd: Math.max(0, enemyHp),
    enemy,
    battleKind,
  };
}

export function resolveBattleWithEnemy(stats, critChanceFromTaps, enemy, battleKind, playerMaxHp) {
  return resolveBattleCore(stats, critChanceFromTaps, enemy, battleKind, playerMaxHp);
}

export function resolveRandomBattle(stats, critChanceFromTaps, playerMaxHp) {
  const enemy = rollEnemy();
  return resolveBattleCore(stats, critChanceFromTaps, enemy, 'random', playerMaxHp);
}

export function resolveSparBattle(stats, critChanceFromTaps, playerMaxHp) {
  return resolveBattleCore(stats, critChanceFromTaps, { ...SPAR_OPPONENT }, 'spar', playerMaxHp);
}
