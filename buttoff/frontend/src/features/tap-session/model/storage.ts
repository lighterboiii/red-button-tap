import { DAILY_BONUS_ROLL_CHANCE, DAILY_MODE_ENDLESS_CHANCE } from '@entities/tap-rules';
import type { TapMode } from '@entities/tap-rules';

const KEY = 'buttoff_tap_session_v4';

export type TapSessionStored = {
  v: 4;
  dayKey: string;
  tapsToday: number;
  lastTapAt: number | null;
  /** Заглушка: авто-тап после кулдауна (только в rationed) */
  subscriptionStub: boolean;
  /**
   * Режим на текущий календарный dayKey.
   * Раз в сутки случайно (для этого «пользователя» = этого браузера/устройства).
   */
  modeForDay: TapMode;
  dailyBonusDismissedDay: string | null;
  dailyBonusRollDay: string | null;
  dailyBonusActive: boolean;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function rollModeForDay(): TapMode {
  return Math.random() < DAILY_MODE_ENDLESS_CHANCE ? 'endless' : 'rationed';
}

function defaultState(): TapSessionStored {
  const day = todayKey();
  return {
    v: 4,
    dayKey: day,
    tapsToday: 0,
    lastTapAt: null,
    subscriptionStub: false,
    modeForDay: rollModeForDay(),
    dailyBonusDismissedDay: null,
    dailyBonusRollDay: null,
    dailyBonusActive: false,
  };
}

function rollDailyBonus(): boolean {
  return Math.random() < DAILY_BONUS_ROLL_CHANCE;
}

type LegacyV2 = {
  v?: number;
  unlimitedLocal?: boolean;
  dayKey?: string;
  tapsToday?: number;
  lastTapAt?: number | null;
  subscriptionStub?: boolean;
  dailyBonusDismissedDay?: string | null;
  dailyBonusRollDay?: string | null;
  dailyBonusActive?: boolean;
};

type LegacyV3 = LegacyV2 & {
  tapMode?: TapMode;
};

function migrateFromV2(legacy: LegacyV2): TapSessionStored {
  const base = defaultState();
  return {
    ...base,
    dayKey: legacy.dayKey ?? base.dayKey,
    tapsToday: legacy.tapsToday ?? 0,
    lastTapAt: legacy.lastTapAt ?? null,
    subscriptionStub: legacy.subscriptionStub ?? false,
    modeForDay: legacy.unlimitedLocal ? 'endless' : 'rationed',
    dailyBonusDismissedDay: legacy.dailyBonusDismissedDay ?? null,
    dailyBonusRollDay: legacy.dailyBonusRollDay ?? null,
    dailyBonusActive: legacy.dailyBonusActive ?? false,
  };
}

function migrateFromV3(legacy: LegacyV3): TapSessionStored {
  const base = defaultState();
  const day = legacy.dayKey ?? base.dayKey;
  return {
    ...base,
    dayKey: day,
    tapsToday: legacy.tapsToday ?? 0,
    lastTapAt: legacy.lastTapAt ?? null,
    subscriptionStub: legacy.subscriptionStub ?? false,
    modeForDay:
      legacy.tapMode === 'endless' || legacy.tapMode === 'rationed'
        ? legacy.tapMode
        : rollModeForDay(),
    dailyBonusDismissedDay: legacy.dailyBonusDismissedDay ?? null,
    dailyBonusRollDay: legacy.dailyBonusRollDay ?? null,
    dailyBonusActive: legacy.dailyBonusActive ?? false,
  };
}

export function loadTapSession(): TapSessionStored {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const v3Raw = localStorage.getItem('buttoff_tap_session_v3');
      if (v3Raw) {
        try {
          const legacy = JSON.parse(v3Raw) as Record<string, unknown>;
          const migrated = applyDayLogic(migrateFromV3(legacy as LegacyV3));
          saveTapSession(migrated);
          localStorage.removeItem('buttoff_tap_session_v3');
          return migrated;
        } catch {
          /* ignore */
        }
      }
      const legacyRaw = localStorage.getItem('buttoff_tap_session_v2');
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw) as LegacyV2;
          const migrated = applyDayLogic(migrateFromV2(legacy));
          saveTapSession(migrated);
          localStorage.removeItem('buttoff_tap_session_v2');
          return migrated;
        } catch {
          /* ignore */
        }
      }
      return applyDayLogic(defaultState());
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const v = parsed.v;
    if (v === 4) {
      const p = parsed as Partial<TapSessionStored>;
      const modeForDay =
        p.modeForDay === 'endless' || p.modeForDay === 'rationed' ? p.modeForDay : rollModeForDay();
      return applyDayLogic({
        ...defaultState(),
        ...(p as TapSessionStored),
        v: 4,
        modeForDay,
      });
    }
    if (v === 3 && (parsed.tapMode === 'rationed' || parsed.tapMode === 'endless')) {
      return applyDayLogic(migrateFromV3(parsed as unknown as LegacyV3));
    }
    if (v === 2) {
      return applyDayLogic(migrateFromV2(parsed as unknown as LegacyV2));
    }
    return applyDayLogic(defaultState());
  } catch {
    return applyDayLogic(defaultState());
  }
}

function applyDayLogic(s: TapSessionStored): TapSessionStored {
  const day = todayKey();
  if (s.dayKey === day) return ensureDailyBonusRoll(s);

  const next: TapSessionStored = {
    ...s,
    dayKey: day,
    tapsToday: 0,
    lastTapAt: null,
    modeForDay: rollModeForDay(),
    dailyBonusDismissedDay: null,
    dailyBonusRollDay: null,
    dailyBonusActive: false,
  };
  return ensureDailyBonusRoll(next);
}

function ensureDailyBonusRoll(s: TapSessionStored): TapSessionStored {
  const day = todayKey();
  if (s.dayKey !== day) return s;
  if (s.dailyBonusRollDay === day) return s;
  const active = rollDailyBonus();
  return {
    ...s,
    dailyBonusRollDay: day,
    dailyBonusActive: active,
  };
}

export function saveTapSession(s: TapSessionStored) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export { todayKey };
