import { RARITY_META } from '@entities/outcome';
import type { TapResult } from '@entities/outcome';
import { GEAR_SLOT_LABELS } from '@entities/gear';
import { TapButton, useTapFlow } from '@features/tap-action';
import { formatCooldownMs } from '@shared/lib/formatCooldown';

function outcomeClass(rarity: TapResult['rarity']) {
  return `tap-panel__outcome tap-panel__outcome--${rarity}`;
}

type Props = {
  /** Добавить выпавшую вещь в инвентарь */
  onTakeDrop: (result: TapResult) => void;
  /** Закрыть экран без сохранения вещи */
  onSkipDrop: () => void;
};

export function TapPanel({ onTakeDrop, onSkipDrop }: Props) {
  const { phase, result, error, reset, manualTap, session } = useTapFlow();
  const rolling = phase === 'rolling';
  const showResult = phase === 'done' && result;
  const mustResetBeforeNext = phase === 'done' && result != null;

  const buttonDisabled =
    rolling || mustResetBeforeNext || (!session.endless && !session.canTap);

  const showLimitCooldown =
    session.rationed && session.blockReason === 'cooldown' && session.cooldownMsLeft > 0;
  const showLimitDaily = session.rationed && session.blockReason === 'daily_limit';

  const handleTake = () => {
    if (result) onTakeDrop(result);
    reset();
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
            <button type="button" className="tap-panel__drop-take" onClick={handleTake}>
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
