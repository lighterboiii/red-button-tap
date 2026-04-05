export type ForgeStored = {
  strikes: number;
  /** null — порог ещё не выбран; задаётся при первом нажатии цикла */
  needed: number | null;
};

const KEY = 'buttoff_forge_v1';

export function defaultForgeState(): ForgeStored {
  return { strikes: 0, needed: null };
}

export function loadForgeState(): ForgeStored {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultForgeState();
    const p = JSON.parse(raw) as Partial<ForgeStored>;
    const strikes = typeof p.strikes === 'number' && Number.isFinite(p.strikes) ? Math.max(0, Math.floor(p.strikes)) : 0;
    const needed =
      p.needed === null || p.needed === undefined
        ? null
        : typeof p.needed === 'number' && Number.isFinite(p.needed)
          ? Math.max(1, Math.floor(p.needed))
          : null;
    if (needed !== null && strikes > needed * 2) return defaultForgeState();
    return { strikes, needed };
  } catch {
    return defaultForgeState();
  }
}

export function saveForgeState(s: ForgeStored): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore quota */
  }
}
