import { useCallback, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { TAP_COOLDOWN_MS } from '@entities/tap-rules';
import { useTapForge } from '@features/tap-forge';
import { useTapSession } from '@features/tap-session/model/useTapSession';
import { useTapOutcome } from './useTapOutcome';

/**
 * Ручной тап + лимит/кулдаун; при subscriptionStub — по истечении кулдауна срабатывает авто-тап (заглушка).
 * Дроп в инвентарь — только после выбора «Взять» в TapPanel.
 * До дропа нужно много нажатий: кузня накапливает «удар», порог скрыт (см. tap-forge).
 */
export function useTapFlow() {
  const session = useTapSession();
  const forge = useTapForge();
  const { phase, result, error, tap, reset } = useTapOutcome();

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const canTapRef = useRef(session.canTap);
  canTapRef.current = session.canTap;
  const endlessRef = useRef(session.endless);
  endlessRef.current = session.endless;

  const runTap = useCallback(async (): Promise<boolean> => {
    if (phaseRef.current === 'rolling') return false;
    if (!endlessRef.current && !canTapRef.current) return false;

    const step = forge.advanceForge();
    if (step === 'ignored' || step === 'charging') return false;

    const out = await tap();
    if (out) {
      forge.onDropResolved();
      if (!endlessRef.current) session.recordTapCommitted();
    }
    return !!out;
  }, [tap, forge.advanceForge, forge.onDropResolved, session.recordTapCommitted]);

  const manualTap = useCallback(async () => {
    await runTap();
  }, [runTap]);

  useEffect(() => {
    if (!session.subscriptionStub || session.endless) return;
    if (session.tapsLeft !== null && session.tapsLeft <= 0) return;
    if (session.lastTapAt == null) return;

    const ms = Math.max(0, session.lastTapAt + TAP_COOLDOWN_MS - Date.now());

    const id = window.setTimeout(() => {
      if (phaseRef.current === 'rolling') return;
      if (phaseRef.current === 'done') {
        flushSync(() => reset());
      }
      void (async () => {
        forge.fastForwardToThreshold();
        await runTap();
      })();
    }, ms);

    return () => window.clearTimeout(id);
  }, [
    session.subscriptionStub,
    session.endless,
    session.tapsLeft,
    session.lastTapAt,
    reset,
    runTap,
    forge.fastForwardToThreshold,
  ]);

  return {
    phase,
    result,
    error,
    reset,
    manualTap,
    session,
  };
}
