import { RARITY_META } from '@entities/outcome';
import type { TapResult } from '@entities/outcome';
import { MAX_TAPS_PER_DAY } from '@entities/tap-rules';
import { TapButton, useTapFlow } from '@features/tap-action';
import { formatCooldownMs } from '@shared/lib/formatCooldown';

function formatChance(p: number) {
  if (p >= 0.01) return `${(p * 100).toFixed(0)}%`;
  return `${(p * 100).toFixed(1)}%`;
}

function outcomeClass(rarity: TapResult['rarity']) {
  return `tap-panel__outcome tap-panel__outcome--${rarity}`;
}

export function TapPanel() {
  const { phase, result, error, reset, manualTap, session } = useTapFlow();
  const rolling = phase === 'rolling';
  const showResult = phase === 'done' && result;
  const mustResetBeforeNext = phase === 'done' && result != null;

  const buttonDisabled =
    rolling || mustResetBeforeNext || (!session.endless && !session.canTap);

  const rationedStatus = (() => {
    if (!session.rationed) return null;
    if (session.blockReason === 'daily_limit') return `На сегодня лимит: ${MAX_TAPS_PER_DAY} тапов. Завтра снова.`;
    if (session.blockReason === 'cooldown') {
      return `Пауза между тапами: ещё ${formatCooldownMs(session.cooldownMsLeft)}.`;
    }
    if (session.tapsLeft != null) return `Сегодня осталось: ${session.tapsLeft} из ${MAX_TAPS_PER_DAY} тапов.`;
    return null;
  })();

  return (
    <section className="tap-panel" aria-labelledby="tap-title">
      <h1 id="tap-title" className="tap-panel__title">
        Buttoff
      </h1>
      <p className="tap-panel__lead">
        Режим на сегодня выбирается случайно (для этого устройства). Исход тапа — заглушка с бэка. Завтра может быть
        иначе.
      </p>

      <div className="tap-panel__today-mode" aria-live="polite">
        <p className="tap-panel__today-mode-label">Сегодня у тебя</p>
        {session.envForcesEndless ? (
          <>
            <p className="tap-panel__today-mode-title">Постоянные тапы</p>
            <p className="tap-panel__today-mode-desc">
              Принудительно через <code>VITE_UNLIMITED_TAPS</code> — дневной бросок режима не действует.
            </p>
          </>
        ) : session.modeForDay === 'rationed' ? (
          <>
            <p className="tap-panel__today-mode-title">Лимит + пауза ~2 ч</p>
            <p className="tap-panel__today-mode-desc">
              Несколько тапов в день и пауза между ними. Подписка — авто-тап после паузы (заглушка).
            </p>
          </>
        ) : (
          <>
            <p className="tap-panel__today-mode-title">Постоянные тапы</p>
            <p className="tap-panel__today-mode-desc">Без лимита на день и без паузы — жми сколько угодно до завтра.</p>
          </>
        )}
      </div>

      {session.showDailyBonusBanner ? (
        <div className="tap-panel__banner tap-panel__banner--daily" role="status">
          <p className="tap-panel__banner-text">
            <strong>Дневной слот (заглушка).</strong> Раз в день с небольшим шансом — потом сюда привяжем награду.
          </p>
          <button type="button" className="tap-panel__banner-dismiss" onClick={session.dismissDailyBonus}>
            Ок
          </button>
        </div>
      ) : null}

      {session.rationed && rationedStatus ? <p className="tap-panel__status">{rationedStatus}</p> : null}
      {session.endless && !session.envForcesEndless ? (
        <p className="tap-panel__status tap-panel__status--endless">Постоянные тапы: паузы и дневной лимит не действуют.</p>
      ) : null}

      <div className="tap-panel__button-wrap">
        <TapButton disabled={buttonDisabled} rolling={rolling} onTap={manualTap} />
      </div>

      {session.rationed ? (
        <div className="tap-panel__sub-box">
          <p className="tap-panel__sub-text">
            Подписка (заглушка): когда пауза спадёт, тап сработает сам, пока есть дневные попытки.
          </p>
          <button
            type="button"
            className={`tap-panel__sub-cta ${session.subscriptionStub ? 'tap-panel__sub-cta--on' : ''}`}
            onClick={() => session.setSubscriptionStub(!session.subscriptionStub)}
          >
            {session.subscriptionStub ? '«Подписка» включена' : 'Оформить «подписку»'}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="tap-panel__error" role="alert">
          {error}. Запусти API: <code>cd backend && npm i && npm run dev</code>
        </p>
      ) : null}

      {showResult && result ? (
        <div className={outcomeClass(result.rarity)}>
          <div className="tap-panel__rarity-row">
            <span className="tap-panel__rarity">{RARITY_META[result.rarity].title}</span>
            <span className="tap-panel__chance">~{formatChance(result.approximateChance)} за эту редкость</span>
          </div>
          <h2 className="tap-panel__label">{result.label}</h2>
          <p className="tap-panel__message">{result.message}</p>
          <p className="tap-panel__hint">{RARITY_META[result.rarity].hint}</p>
          <button type="button" className="tap-panel__again" onClick={reset}>
            Ещё раз
          </button>
        </div>
      ) : null}

      {rolling ? (
        <p className="tap-panel__rolling" aria-live="polite">
          Крутим…
        </p>
      ) : null}
    </section>
  );
}
