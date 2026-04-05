import { useEffect, useRef, useState } from 'react';
import {
  computeItemCombatStats,
  TOTAL_CRIT_CAP,
  type BattleOutcome,
  type CombatStats,
  type ItemCombatStats,
} from '@entities/combat';
import { GEAR_SLOTS, GEAR_SLOT_LABELS, type GearItem, type GearSlot } from '@entities/gear';

/** Пауза перед первой строкой журнала — «заводится» бой */
const BATTLE_LOG_FIRST_MS = 480;
/** Между строками хода — видно развитие схватки */
const BATTLE_LOG_STEP_MS = 560;

type Props = {
  avatarUrl?: string | null;
  displayName?: string | null;
  gear: {
    inventory: GearItem[];
    equipped: Record<GearSlot, GearItem | null>;
    equip: (id: string) => void;
    unequip: (slot: GearSlot) => void;
    runRandomBattle: () => void;
    runSparBattle: () => void;
    canBattle: boolean;
    canSpar: boolean;
    combatStats: CombatStats;
    critChanceFromTaps: number;
    lastBattle: BattleOutcome | null;
    dismissLastBattle: () => void;
  };
};

function formatCritPct(crit: number): string {
  return `${(crit * 100).toFixed(1)}%`;
}

function ItemCombatLine({ stats }: { stats: ItemCombatStats }) {
  return (
    <span className="character-panel__item-combat">
      Атк {stats.attack} · Защ {stats.defense} · Крит {formatCritPct(stats.critChance)}
    </span>
  );
}

export function CharacterPanel({ gear, avatarUrl, displayName }: Props) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  /** Сколько строк журнала боя уже показано (пошагово). */
  const [battleLogRevealed, setBattleLogRevealed] = useState(0);
  const replaySkipRef = useRef(false);
  const {
    inventory,
    equipped,
    equip,
    unequip,
    runRandomBattle,
    runSparBattle,
    canBattle,
    canSpar,
    combatStats,
    critChanceFromTaps,
    lastBattle,
    dismissLastBattle,
  } = gear;

  const totalCrit = Math.min(TOTAL_CRIT_CAP, combatStats.critFromGear + critChanceFromTaps);

  useEffect(() => {
    replaySkipRef.current = false;
    if (!lastBattle) {
      setBattleLogRevealed(0);
      return;
    }
    const n = lastBattle.rounds.length;
    if (n === 0) {
      setBattleLogRevealed(0);
      return;
    }
    setBattleLogRevealed(0);
    let cancelled = false;
    let count = 0;
    let tid: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled || replaySkipRef.current) return;
      count += 1;
      setBattleLogRevealed(count);
      if (count < n) {
        tid = setTimeout(step, BATTLE_LOG_STEP_MS);
      }
    };

    tid = setTimeout(step, BATTLE_LOG_FIRST_MS);
    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [lastBattle]);

  const battleLogComplete =
    lastBattle != null && battleLogRevealed >= lastBattle.rounds.length;

  return (
    <section className="character-panel" aria-label="Персонаж">
      <div className="character-panel__figure">
        {avatarUrl && !avatarBroken ? (
          <img
            className="character-panel__avatar"
            src={avatarUrl}
            alt={displayName ? `Аватар: ${displayName}` : 'Аватар'}
            width={112}
            height={144}
            decoding="async"
            onError={() => setAvatarBroken(true)}
          />
        ) : (
          <div className="character-panel__silhouette" aria-hidden />
        )}
      </div>

      <p className="character-panel__stats-legend">
        Цифры внизу — сумма по <strong>надетым</strong> вещам. На каждой вещи в инвентаре и в слотах указан её
        вклад.
      </p>
      <dl className="character-panel__stats" aria-label="Боевые характеристики">
        <div className="character-panel__stat">
          <dt>Атака</dt>
          <dd>{combatStats.attack}</dd>
        </div>
        <div className="character-panel__stat">
          <dt>Защита</dt>
          <dd>{combatStats.defense}</dd>
        </div>
        <div className="character-panel__stat character-panel__stat--crit">
          <dt>Крит</dt>
          <dd>
            <span className="character-panel__stat-value">{formatCritPct(totalCrit)}</span>
            <span className="character-panel__stat-split">
              {formatCritPct(combatStats.critFromGear)} экип. + {formatCritPct(critChanceFromTaps)} тапы
            </span>
          </dd>
        </div>
      </dl>

      <ul className="character-panel__slots">
        {GEAR_SLOTS.map((slot) => {
          const item = equipped[slot];
          const itemStats = item ? computeItemCombatStats(item) : null;
          return (
            <li key={slot} className="character-panel__slot">
              <span className="character-panel__slot-name">{GEAR_SLOT_LABELS[slot]}</span>
              {item && itemStats ? (
                <button
                  type="button"
                  className={`character-panel__item character-panel__item--${item.rarity}`}
                  onClick={() => unequip(slot)}
                  title={`Снять · Атк ${itemStats.attack} / Защ ${itemStats.defense} / Крит ${formatCritPct(itemStats.critChance)}`}
                >
                  <span className="character-panel__item-top">
                    <span className="character-panel__item-label">{item.label}</span>
                    <span className="character-panel__dur">
                      {item.durability}/{item.maxDurability}
                    </span>
                  </span>
                  <ItemCombatLine stats={itemStats} />
                </button>
              ) : (
                <span className="character-panel__empty">—</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="character-panel__battle">
        <div className="character-panel__battle-actions">
          <button
            type="button"
            className="character-panel__battle-btn"
            disabled={!canBattle}
            onClick={() => runRandomBattle()}
          >
            Случайный бой
          </button>
          <button
            type="button"
            className="character-panel__battle-btn character-panel__battle-btn--spar"
            disabled={!canSpar}
            onClick={() => runSparBattle()}
          >
            Тренировка
          </button>
        </div>
        <p className="character-panel__battle-hint">
          Тренировка — бой с манекеном, экипировка не трескается. Случайный бой — настоящий враг и износ вещей.
        </p>
      </div>

      {lastBattle ? (
        <div
          className={`character-panel__battle-overlay ${
            lastBattle.battleKind === 'spar' ? 'character-panel__battle-overlay--spar' : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            battleLogComplete ? 'character-panel-battle-title' : 'character-panel-battle-live'
          }
        >
          <div
            className={[
              'character-panel__battle-sheet',
              lastBattle.battleKind === 'spar' ? 'character-panel__battle-sheet--spar' : '',
              battleLogComplete ? '' : 'character-panel__battle-sheet--playing',
              battleLogComplete
                ? lastBattle.won
                  ? 'character-panel__battle-sheet--outcome-win'
                  : 'character-panel__battle-sheet--outcome-loss'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {lastBattle.battleKind === 'spar' ? (
              <p className="character-panel__battle-ribbon" role="presentation">
                Тренировочный полигон
              </p>
            ) : null}
            {!battleLogComplete ? (
              <h3 id="character-panel-battle-live" className="character-panel__battle-live-title">
                Журнал боя
              </h3>
            ) : null}
            <ul className="character-panel__battle-log" aria-live="polite" aria-relevant="additions">
              {lastBattle.rounds.slice(0, battleLogRevealed).map((r) => (
                <li key={r.round} className="character-panel__battle-log-line">
                  {r.text}
                </li>
              ))}
            </ul>
            {!battleLogComplete ? (
              <p className="character-panel__battle-pulse" aria-hidden>
                <span className="character-panel__battle-pulse-dot" />
                Бой идёт
              </p>
            ) : null}
            {!battleLogComplete ? (
              <button
                type="button"
                className="character-panel__battle-skip-log"
                onClick={() => {
                  replaySkipRef.current = true;
                  setBattleLogRevealed(lastBattle.rounds.length);
                }}
              >
                Показать всё
              </button>
            ) : null}
            {battleLogComplete ? (
              <div
                className={`character-panel__battle-result character-panel__battle-result--${
                  lastBattle.won ? 'win' : 'loss'
                }`}
              >
                <h3
                  id="character-panel-battle-title"
                  className={`character-panel__battle-title character-panel__battle-title--${
                    lastBattle.won ? 'win' : 'loss'
                  }`}
                >
                  {lastBattle.won ? 'Победа' : 'Поражение'}
                </h3>
                <p
                  className={`character-panel__battle-enemy character-panel__battle-enemy--${
                    lastBattle.won ? 'win' : 'loss'
                  }`}
                >
                  {lastBattle.enemy.name}
                </p>
                <p
                  className={`character-panel__battle-summary character-panel__battle-summary--${
                    lastBattle.won ? 'win' : 'loss'
                  }`}
                >
                  Твой HP: {lastBattle.playerHpStart} → {lastBattle.playerHpEnd} ·{' '}
                  {lastBattle.battleKind === 'spar' ? 'Манекен' : 'Враг'}: {lastBattle.enemyHpStart} →{' '}
                  {lastBattle.enemyHpEnd}
                </p>
              </div>
            ) : null}
            <button
              type="button"
              className="character-panel__battle-ok"
              disabled={!battleLogComplete}
              onClick={() => dismissLastBattle()}
            >
              Ок
            </button>
          </div>
        </div>
      ) : null}

      <div className="character-panel__stash">
        <h2 className="character-panel__stash-title">Инвентарь</h2>
        {inventory.length === 0 ? (
          <p className="character-panel__stash-empty">—</p>
        ) : (
          <ul className="character-panel__stash-list">
            {inventory.map((item) => {
              const s = computeItemCombatStats(item);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`character-panel__stash-chip character-panel__stash-chip--${item.rarity}`}
                    onClick={() => equip(item.id)}
                    title={`Надеть · Атк ${s.attack} / Защ ${s.defense} / Крит ${formatCritPct(s.critChance)}`}
                  >
                    <span className="character-panel__stash-slot">{GEAR_SLOT_LABELS[item.slot]}</span>
                    <span className="character-panel__stash-label">{item.label}</span>
                    <span className="character-panel__stash-meta">
                      {item.durability}/{item.maxDurability}
                    </span>
                    <ItemCombatLine stats={s} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
