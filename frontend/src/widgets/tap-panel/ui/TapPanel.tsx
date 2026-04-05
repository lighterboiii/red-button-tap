import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { RARITY_META } from '@entities/outcome';
import type { TapResult } from '@entities/outcome';
import type { ItemCombatStats } from '@entities/combat';
import {
  critPctShort,
  FORGE_LEGENDARY_PREVIEW,
  forgePreviewJewelryEffectText,
  GEAR_SLOT_LABELS,
  type ForgeLegendaryPreview,
  SlotTypeIcon,
} from '@entities/gear';
import { TapButton, useTapFlow } from '@features/tap-action';
import { postCombatItemStats } from '@shared/api/client';
import { formatCooldownMs } from '@shared/lib/formatCooldown';

function outcomeClass(rarity: TapResult['rarity']) {
  return `tap-panel__outcome tap-panel__outcome--${rarity}`;
}

function formatCritPct(crit: number): string {
  return `${(crit * 100).toFixed(1)}%`;
}

function forgeLegendaryChip(
  entry: ForgeLegendaryPreview,
  keySuffix: string,
  onSelect: (e: ForgeLegendaryPreview) => void,
) {
  return (
    <li key={`${entry.catalogId}${keySuffix}`} className="tap-panel__legendary-chip">
      <button
        type="button"
        className="tap-panel__legendary-chip-hit"
        onClick={() => onSelect(entry)}
        aria-label={`Подробнее: ${entry.label}`}
      >
        <div className="tap-panel__legendary-chip-tile equip-tile equip-tile--legendary">
          <span className="equip-tile__atk" aria-hidden>
            {entry.atkDelta}
          </span>
          <span className="equip-tile__crit" aria-hidden>
            {critPctShort(entry.critDelta)}
          </span>
          <span className="equip-tile__def" aria-hidden>
            {entry.defDelta}
          </span>
          <span className="equip-tile__icon">
            <SlotTypeIcon slot={entry.slot} className="equip-tile__icon-svg" />
          </span>
        </div>
        <span className="tap-panel__legendary-chip-label">{entry.label}</span>
      </button>
    </li>
  );
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
  const [legendaryDetail, setLegendaryDetail] = useState<ForgeLegendaryPreview | null>(null);
  const [legendaryPreviewStats, setLegendaryPreviewStats] = useState<ItemCombatStats | null>(null);
  const forgeDetailTitleId = useId();

  useEffect(() => {
    if (!result) {
      setDropStats(null);
      return;
    }
    let cancelled = false;
    setDropStats(null);
    void (async () => {
      try {
        const s = await postCombatItemStats({
          catalogId: result.drop.catalogId,
          slot: result.drop.slot,
          rarity: result.rarity,
        });
        if (!cancelled) setDropStats(s);
      } catch {
        if (!cancelled) setDropStats(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result?.id, result?.drop.slot, result?.rarity]);

  useEffect(() => {
    if (!legendaryDetail) {
      setLegendaryPreviewStats(null);
      return;
    }
    let cancelled = false;
    setLegendaryPreviewStats(null);
    void (async () => {
      try {
        const s = await postCombatItemStats({
          catalogId: legendaryDetail.catalogId,
          slot: legendaryDetail.slot,
          rarity: 'legendary',
        });
        if (!cancelled) setLegendaryPreviewStats(s);
      } catch {
        if (!cancelled) setLegendaryPreviewStats(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [legendaryDetail?.catalogId, legendaryDetail?.slot]);

  useEffect(() => {
    if (!legendaryDetail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLegendaryDetail(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [legendaryDetail]);

  const buttonDisabled =
    rolling || mustResetBeforeNext || (!session.endless && !session.canTap);

  const showLimitCooldown =
    session.rationed && session.blockReason === 'cooldown' && session.cooldownMsLeft > 0;
  const showLimitDaily = session.rationed && session.blockReason === 'daily_limit';

  const equipAllowed = Boolean(result && canEquipTapDrop(result));

  const forgeJewelryEffectLine =
    legendaryDetail != null ? forgePreviewJewelryEffectText(legendaryDetail) : null;

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
    <section className="tap-panel" aria-label="Кузня">
      <h1 className="tap-panel__sr-only">Кузня</h1>

      <div className="tap-panel__legendary-preview">
        <p className="tap-panel__legendary-preview-title" id="tap-panel-legendary-preview-h">
          Наметки легендарного пламени
        </p>
        <div className="tap-panel__legendary-marquee" aria-labelledby="tap-panel-legendary-preview-h">
          <div className="tap-panel__legendary-marquee-viewport">
            <div className="tap-panel__legendary-marquee-track">
              <ul className="tap-panel__legendary-scroll">
                {FORGE_LEGENDARY_PREVIEW.map((entry) => forgeLegendaryChip(entry, '', setLegendaryDetail))}
              </ul>
              <ul className="tap-panel__legendary-scroll tap-panel__legendary-scroll--duplicate" aria-hidden>
                {FORGE_LEGENDARY_PREVIEW.map((entry) => forgeLegendaryChip(entry, '-dup', setLegendaryDetail))}
              </ul>
            </div>
          </div>
        </div>
      </div>

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
                <SlotTypeIcon slot={result.drop.slot} className="tap-panel__drop-icon-svg" />
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

      <p className="tap-panel__forge-hint">
        Направь волю на невидимую кузню: каждое касание подпитывает пламя, пока из недр пустоты не проявится
        облик вещи.
      </p>

      {legendaryDetail
        ? createPortal(
            <>
              <button
                type="button"
                className="character-panel__item-detail-backdrop"
                aria-label="Закрыть"
                onClick={() => setLegendaryDetail(null)}
              />
              <div
                className="character-panel__item-detail character-panel__item-detail--legendary"
                role="dialog"
                aria-modal="true"
                aria-labelledby={forgeDetailTitleId}
              >
                <h3 id={forgeDetailTitleId} className="character-panel__item-detail-name">
                  {legendaryDetail.label}
                </h3>
                <p className="character-panel__item-detail-rarity">{RARITY_META.legendary.title}</p>
                <dl className="character-panel__item-detail-dl">
                  <div>
                    <dt>Слот</dt>
                    <dd>{GEAR_SLOT_LABELS[legendaryDetail.slot]}</dd>
                  </div>
                  <div>
                    <dt>Атака</dt>
                    <dd>{legendaryPreviewStats ? legendaryPreviewStats.attack : '…'}</dd>
                  </div>
                  <div>
                    <dt>Защита</dt>
                    <dd>{legendaryPreviewStats ? legendaryPreviewStats.defense : '…'}</dd>
                  </div>
                  <div>
                    <dt>Крит</dt>
                    <dd>{legendaryPreviewStats ? formatCritPct(legendaryPreviewStats.critChance) : '…'}</dd>
                  </div>
                </dl>
                {forgeJewelryEffectLine ? (
                  <p className="tap-panel__forge-preview-effect">{forgeJewelryEffectLine}</p>
                ) : null}
                <div className="tap-panel__forge-detail-actions character-panel__item-detail-actions">
                  <button
                    type="button"
                    className="character-panel__item-detail-close"
                    onClick={() => setLegendaryDetail(null)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </section>
  );
}
