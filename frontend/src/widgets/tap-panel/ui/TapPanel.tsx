import { RARITY_META } from '@entities/outcome';
import type { TapResult } from '@entities/outcome';
import { GEAR_SLOT_LABELS } from '@entities/gear';
import { TapButton, useTapFlow } from '@features/tap-action';
import { formatCooldownMs } from '@shared/lib/formatCooldown';

function outcomeClass(rarity: TapResult['rarity']) {
  return `tap-panel__outcome tap-panel__outcome--${rarity}`;
}

type Props = {
  /** Добавить выпавшую вещь в инвентарь (может быть async — опыт с сервера) */
  onTakeDrop: (result: TapResult) => void | Promise<void>;
  /** Закрыть экран без сохранения вещи */
  onSkipDrop: () => void;
  /** Рюкзак заполнен — «Взять» недоступно */
  inventoryFull?: boolean;
};

export function TapPanel({ onTakeDrop, onSkipDrop, inventoryFull }: Props) {
  const { phase, result, error, reset, manualTap, session } = useTapFlow();
  const rolling = phase === 'rolling';
  const showResult = phase === 'done' && result;
  const mustResetBeforeNext = phase === 'done' && result != null;

  const buttonDisabled =
    rolling || mustResetBeforeNext || (!session.endless && !session.canTap);

  const showLimitCooldown =
    session.rationed && session.blockReason === 'cooldown' && session.cooldownMsLeft > 0;
  const showLimitDaily = session.rationed && session.blockReason === 'daily_limit';

  const handleTake = async () => {
    if (inventoryFull || !result) return;
    try {
      await onTakeDrop(result);
      reset();
    } catch {
      /* прогрессия не применилась — экран дропа остаётся */
    }
  };

  const handleSkip = () => {
    onSkipDrop();
    reset();
  };

  return (
    <section className="tap-panel" aria-label="Тап">
      <h1 className="tap-panel__sr-only">Тап</h1>

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
          <div className="tap-panel__rarity-row">
            <span className="tap-panel__rarity">{RARITY_META[result.rarity].title}</span>
          </div>
          <h2 className="tap-panel__label">{result.label}</h2>
          <p className="tap-panel__message">{result.message}</p>
          <p className="tap-panel__drop">
            Вещь: {GEAR_SLOT_LABELS[result.drop.slot]} · {result.drop.label}
          </p>
          <div className="tap-panel__drop-actions" role="group" aria-label="Дроп с тапа">
            {inventoryFull ? (
              <p className="tap-panel__inv-full" role="status">
                Инвентарь полон — надень или убери вещи на вкладке «Персонаж».
              </p>
            ) : null}
            <button
              type="button"
              className="tap-panel__drop-take"
              disabled={Boolean(inventoryFull)}
              title={inventoryFull ? 'Рюкзак заполнен' : undefined}
              onClick={handleTake}
            >
              Взять
            </button>
            <button type="button" className="tap-panel__drop-skip" onClick={handleSkip}>
              Пропустить
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
