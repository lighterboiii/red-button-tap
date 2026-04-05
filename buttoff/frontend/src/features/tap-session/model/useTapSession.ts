import { useCallback, useEffect, useMemo, useState } from 'react';
import { TAP_COOLDOWN_MS } from '@entities/tap-rules';
import type { TapBlockReason } from '@entities/tap-rules';
import { MAX_TAPS_PER_DAY } from '@entities/tap-rules';
import { loadTapSession, saveTapSession, todayKey, type TapSessionStored } from './storage';

const ENV_UNLIMITED = import.meta.env.VITE_UNLIMITED_TAPS === 'true';

function canTapNow(s: TapSessionStored, endless: boolean, now: number): { ok: boolean; reason: TapBlockReason } {
  if (endless) return { ok: true, reason: 'ok' };
  if (s.tapsToday >= MAX_TAPS_PER_DAY) return { ok: false, reason: 'daily_limit' };
  if (s.lastTapAt != null && now - s.lastTapAt < TAP_COOLDOWN_MS) {
    return { ok: false, reason: 'cooldown' };
  }
  return { ok: true, reason: 'ok' };
}

export function useTapSession() {
  const [session, setSession] = useState<TapSessionStored>(() => loadTapSession());
  const [tick, setTick] = useState(0);

  /** Без лимита: env или сегодняшний случайный режим для этого устройства. */
  const endless = ENV_UNLIMITED || session.modeForDay === 'endless';
  const rationed = !endless;

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { canTap, blockReason, cooldownMsLeft, nextTapAt, tapsLeft } = useMemo(() => {
    const now = Date.now();
    const s = session;
    const { ok, reason } = canTapNow(s, endless, now);
    let cd = 0;
    if (rationed && s.lastTapAt != null) {
      const end = s.lastTapAt + TAP_COOLDOWN_MS;
      cd = Math.max(0, end - now);
    }
    return {
      canTap: ok,
      blockReason: ok ? ('ok' as const) : reason,
      cooldownMsLeft: cd,
      nextTapAt: rationed && s.lastTapAt != null ? s.lastTapAt + TAP_COOLDOWN_MS : null,
      tapsLeft: endless ? null : Math.max(0, MAX_TAPS_PER_DAY - s.tapsToday),
    };
  }, [session, endless, rationed, tick]);

  const recordTapCommitted = useCallback(() => {
    setSession((prev) => {
      const next: TapSessionStored = {
        ...prev,
        tapsToday: prev.tapsToday + 1,
        lastTapAt: Date.now(),
      };
      saveTapSession(next);
      return next;
    });
  }, []);

  const setSubscriptionStub = useCallback((on: boolean) => {
    setSession((prev) => {
      const next = { ...prev, subscriptionStub: on };
      saveTapSession(next);
      return next;
    });
  }, []);

  const dismissDailyBonus = useCallback(() => {
    const day = todayKey();
    setSession((prev) => {
      const next = {
        ...prev,
        dailyBonusActive: false,
        dailyBonusDismissedDay: day,
      };
      saveTapSession(next);
      return next;
    });
  }, []);

  return useMemo(() => {
    const showDailyBonusBanner =
      session.dailyBonusActive && session.dailyBonusDismissedDay !== todayKey();

    return {
      modeForDay: session.modeForDay,
      endless,
      rationed,
      envForcesEndless: ENV_UNLIMITED,
      subscriptionStub: session.subscriptionStub,
      lastTapAt: session.lastTapAt,
      tapsLeft,
      cooldownMsLeft,
      nextTapAt,
      canTap,
      blockReason,
      recordTapCommitted,
      setSubscriptionStub,
      showDailyBonusBanner,
      dismissDailyBonus,
    };
  }, [
    session.modeForDay,
    session.subscriptionStub,
    session.lastTapAt,
    session.dailyBonusActive,
    session.dailyBonusDismissedDay,
    endless,
    rationed,
    tapsLeft,
    cooldownMsLeft,
    nextTapAt,
    canTap,
    blockReason,
    recordTapCommitted,
    setSubscriptionStub,
    dismissDailyBonus,
  ]);
}
