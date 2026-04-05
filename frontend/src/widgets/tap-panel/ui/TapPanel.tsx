import { useEffect, useState } from 'react';
import { RARITY_META } from '@entities/outcome';
import type { TapResult } from '@entities/outcome';
import type { ItemCombatStats } from '@entities/combat';
import { GEAR_SLOT_LABELS, SLOT_TILE_GLYPH } from '@entities/gear';
import { TapButton, useTapFlow } from '@features/tap-action';
import { postCombatItemStats } from '@shared/api/client';
import { formatCooldownMs } from '@shared/lib/formatCooldown';

function outcomeClass(rarity: TapResult['rarity']) {
  return `tap-panel__outcome tap-panel__outcome--${rarity}`;
}

function formatCritPct(crit: number): string {
  return `${(crit * 100).toFixed(1)}%`;
}

type Props = {
  /** Положить в рюкзак (опыт с сервера) */
  onTakeToInventory: (result: TapResult) => void | Promise<void>;
  /** Сразу надень в слот (опыт с сервера) */
  onEquip: (result: TapResult) => void | Promise<void>;
  /** Выбросить дроп без награды */
  onDiscard: () => void;
  inventoryFull: boolean;
  /** Можно ли снять текущую вещь в рюкзак при «Надеть» */
  canEquipTapDrop: (result: TapResult) => boolean;
};

export function TapPanel({
  onTakeToInventory,
  onEquip,
  onDiscard,
  inventoryFull,
  canEquipTapDrop,
}: Props) {
  const { phase, result, error, reset, manualTap, session } = useTapFlow();
  const rolling = phase === 'rolling';
  const showResult = phase === 'done' && result;
  const mustResetBeforeNext = phase === 'done' && result != null;

  const [dropStats, setDropStats] = useState<ItemCombatStats | null>(null);

  useEffect(() => {
    if (!result) {
      setDropStats(null);
      return;
    }
    let cancelled = false;
    setDropStats(null);
    void (async () => {
      try {
        const s = await postCombatItemStats({ slot: result.drop.slot, rarity: result.rarity });
        if (!cancelled) setDropStats(s);
      } catch {
        if (!cancelled) setDropStats(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result?.id, result?.drop.slot, result?.rarity]);

  const buttonDisabled =
    rolling || mustResetBeforeNext || (!session.endless && !session.canTap);

  const showLimitCooldown =
    session.rationed && session.blockReason === 'cooldown' && session.cooldownMsLeft > 0;
  const showLimitDaily = session.rationed && session.blockReason === 'daily_limit';

  const equipAllowed = Boolean(result && canEquipTapDrop(result));

  const handleTake = async () => {
    if (inventoryFull || !result) return;
    try {
      await onTakeToInventory(result);
      reset();
    } catch {
      /* прогрессия не применилась */
    }
  };

  const handleEquip = async () => {
    if (!result || !equipAllowed) return;
    try {
      await onEquip(result);
      reset();
    } catch {
      /* прогрессия не применилась */
    }
  };

  const handleDiscard = () => {
    onDiscard();
    reset();
  };

  return (
    <section className="tap-panel" aria-label="Добыча">
      <h1 className="tap-panel__sr-only">Добыча</h1>

      <div className="tap-panel__button-wrap">
        <TapButton disabled={buttonDisabled} rolling={rolling} onTap={manualTap} />
      </div>

      {showLimitCooldown ? (
        <div className="tap-panel__limit" role="status" aria-live="polite">
          <p className="tap-panel__limit-timer">{formatCooldownMs(session.cooldownMsLeft)}</p>
        </div>
      ) : null}

      {showLimitDaily ? (
        <div className="tap-panel__limit tap-panel__limit--daily" role="status">
          <p className="tap-panel__limit-desc">—</p>
        </div>
      ) : null}

      {error ? (
        <p className="tap-panel__error" role="alert">
          {error}
        </p>
      ) : null}

      {showResult && result ? (
        <div className={outcomeClass(result.rarity)}>
          <div className="tap-panel__drop-card">
            <div
              className={`tap-panel__drop-icon-wrap tap-panel__drop-icon-wrap--${result.rarity}`}
              aria-hidden
            >
              <span className={`tap-panel__drop-icon tap-panel__drop-icon--${result.rarity}`}>
                {SLOT_TILE_GLYPH[result.drop.slot]}
              </span>
            </div>
            <div className="tap-panel__drop-main">
              <div className="tap-panel__rarity-row">
                <span className="tap-panel__rarity">{RARITY_META[result.rarity].title}</span>
              </div>
              <p className="tap-panel__slot-type">{GEAR_SLOT_LABELS[result.drop.slot]}</p>
              <h2 className="tap-panel__label">{result.drop.label}</h2>
            </div>
          </div>

          <dl className="tap-panel__drop-stats" aria-label="Характеристики предмета">
            <div className="tap-panel__drop-stat">
              <dt>Атака</dt>
              <dd>{dropStats ? dropStats.attack : '…'}</dd>
            </div>
            <div className="tap-panel__drop-stat">
              <dt>Защита</dt>
              <dd>{dropStats ? dropStats.defense : '…'}</dd>
            </div>
            <div className="tap-panel__drop-stat">
              <dt>Крит</dt>
              <dd>{dropStats ? formatCritPct(dropStats.critChance) : '…'}</dd>
            </div>
          </dl>

          <div className="tap-panel__drop-actions" role="group" aria-label="Действия с дропом">
            {inventoryFull ? (
              <p className="tap-panel__inv-full" role="status">
                Рюкзак полон — «Взять» недоступно.
              </p>
            ) : null}
            {!equipAllowed ? (
              <p className="tap-panel__inv-full tap-panel__inv-full--equip" role="status">
                Нет места в рюкзаке под снятую вещь — освободи ячейку, чтобы надеть сразу.
              </p>
            ) : null}
            <button
              type="button"
              className="tap-panel__drop-take"
              disabled={inventoryFull}
              title={inventoryFull ? 'Рюкзак заполнен' : undefined}
              onClick={handleTake}
            >
              Взять
            </button>
            <button
              type="button"
              className="tap-panel__drop-equip"
              disabled={!equipAllowed}
              title={!equipAllowed ? 'Нет места в рюкзаке под снятую вещь' : 'Надеть сразу'}
              onClick={handleEquip}
            >
              Надеть
            </button>
            <button type="button" className="tap-panel__drop-skip" onClick={handleDiscard}>
              Выбросить
            </button>
          </div>
        </div>
      ) : null}

      {rolling ? (
        <p className="tap-panel__rolling" aria-live="polite">
          …
        </p>
      ) : null}
    </section>
  );
}
