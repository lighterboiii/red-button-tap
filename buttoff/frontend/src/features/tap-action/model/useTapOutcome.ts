import { useCallback, useState } from 'react';
import { postTap } from '@shared/api/client';
import type { TapResult } from '@entities/outcome';

type Phase = 'idle' | 'rolling' | 'done' | 'error';

export function useTapOutcome() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<TapResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Успешный ответ API или null при ошибке */
  const tap = useCallback(async (): Promise<TapResult | null> => {
    setError(null);
    setPhase('rolling');
    setResult(null);
    try {
      const [out] = await Promise.all([postTap(), delay(380)]);
      setResult(out);
      setPhase('done');
      return out;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сети');
      setPhase('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
  }, []);

  return { phase, result, error, tap, reset };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
