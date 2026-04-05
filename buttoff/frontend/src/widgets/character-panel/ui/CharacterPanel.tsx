import { useState } from 'react';
import {
  computeItemCombatStats,
  TOTAL_CRIT_CAP,
  type BattleOutcome,
  type CombatStats,
  type ItemCombatStats,
} from '@entities/combat';
import { GEAR_SLOTS, GEAR_SLOT_LABELS, type GearItem, type GearSlot } from '@entities/gear';

type Props = {
  avatarUrl?: string | null;
  displayName?: string | null;
  gear: {
    inventory: GearItem[];
    equipped: Record<GearSlot, GearItem | null>;
    equip: (id: string) => void;
    unequip: (slot: GearSlot) => void;
    runBattle: () => void;
    canBattle: boolean;
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
  const {
    inventory,
    equipped,
    equip,
    unequip,
    runBattle,
    canBattle,
    combatStats,
    critChanceFromTaps,
    lastBattle,
    dismissLastBattle,
  } = gear;

  const totalCrit = Math.min(TOTAL_CRIT_CAP, combatStats.critFromGear + critChanceFromTaps);

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
        <button
          type="button"
          className="character-panel__battle-btn"
          disabled={!canBattle}
          onClick={() => runBattle()}
        >
          Случайный бой
        </button>
      </div>

      {lastBattle ? (
        <div
          className="character-panel__battle-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="character-panel-battle-title"
        >
          <div className="character-panel__battle-sheet">
            <h3 id="character-panel-battle-title" className="character-panel__battle-title">
              {lastBattle.won ? 'Победа' : 'Поражение'}
            </h3>
            <p className="character-panel__battle-enemy">{lastBattle.enemy.name}</p>
            <p className="character-panel__battle-summary">
              Твой HP: {lastBattle.playerHpStart} → {lastBattle.playerHpEnd} · Враг:{' '}
              {lastBattle.enemyHpStart} → {lastBattle.enemyHpEnd}
            </p>
            <ul className="character-panel__battle-log">
              {lastBattle.rounds.map((r) => (
                <li key={r.round}>{r.text}</li>
              ))}
            </ul>
            <button type="button" className="character-panel__battle-ok" onClick={() => dismissLastBattle()}>
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
