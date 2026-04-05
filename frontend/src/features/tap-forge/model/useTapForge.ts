import { useCallback, useRef, useState } from 'react';
import { FORGE_TAP_MIN_INTERVAL_MS, FORGE_TAPS_MAX, FORGE_TAPS_MIN } from './forgeConstants';
import { defaultForgeState, loadForgeState, saveForgeState, type ForgeStored } from './forgeStorage';

function rollTarget(): number {
  const min = FORGE_TAPS_MIN;
  const max = FORGE_TAPS_MAX;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] % (max - min + 1));
}

export function useTapForge() {
  const [state, setState] = useState<ForgeStored>(() => loadForgeState());
  const stateRef = useRef(state);
  stateRef.current = state;
  const lastStrikeAtMsRef = useRef(0);

  const persist = useCallback((next: ForgeStored) => {
    stateRef.current = next;
    saveForgeState(next);
    setState(next);
  }, []);

  const resetForge = useCallback(() => {
    lastStrikeAtMsRef.current = 0;
    persist(defaultForgeState());
  }, [persist]);

  /**
   * Один логический шаг кузни: либо удар по наковальне, либо (если порог уже достигнут — повтор после ошибки API) сразу готовность к броску.
   * Всегда читает/пишет через stateRef — без гонок с React state.
   */
  const advanceForge = useCallback((): 'charging' | 'ready' | 'ignored' => {
    const prev = stateRef.current;
    if (prev.needed !== null && prev.strikes >= prev.needed) {
      return 'ready';
    }
    const now = Date.now();
    if (now - lastStrikeAtMsRef.current < FORGE_TAP_MIN_INTERVAL_MS) {
      return 'ignored';
    }
    lastStrikeAtMsRef.current = now;

    const needed = prev.needed ?? rollTarget();
    const strikes = prev.strikes + 1;
    const next: ForgeStored = { strikes, needed };
    persist(next);
    return strikes < needed ? 'charging' : 'ready';
  }, [persist]);

  /** Для авто-тапа подписки: довести кузню до порога без лишних кликов. */
  const fastForwardToThreshold = useCallback(() => {
    const prev = stateRef.current;
    const needed = prev.needed ?? rollTarget();
    const next: ForgeStored = { strikes: needed, needed };
    persist(next);
  }, [persist]);

  const onDropResolved = useCallback(() => {
    lastStrikeAtMsRef.current = 0;
    persist(defaultForgeState());
  }, [persist]);

  return {
    advanceForge,
    fastForwardToThreshold,
    resetForge,
    onDropResolved,
  };
}
