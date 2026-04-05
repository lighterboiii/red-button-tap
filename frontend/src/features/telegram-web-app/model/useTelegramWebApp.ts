import { useEffect, useState } from 'react';
import type { TelegramWebAppUser } from '@shared/types/telegram-web-app';

export type TelegramAppState = {
  /** Есть объект Telegram WebApp (открыто внутри Telegram) */
  isTelegram: boolean;
  /** initData для бэкенда */
  initData: string;
  /** Распарсенный user (без подписи; для UI; доверять на сервере только после verify) */
  user: TelegramWebAppUser | null;
};

/**
 * Инициализация Mini App: ready, expand, тема.
 */
export function useTelegramWebApp(): TelegramAppState {
  const [state, setState] = useState<TelegramAppState>({
    isTelegram: false,
    initData: '',
    user: null,
  });

  useEffect(() => {
    const w = window.Telegram?.WebApp;
    if (!w) {
      setState({ isTelegram: false, initData: '', user: null });
      return;
    }

    w.ready();
    w.expand();
    /** Цвет шапки/фона — только с Web App API 6.1+, иначе SDK шумит в консоли на 6.0 */
    const canSetThemeColors =
      typeof w.isVersionAtLeast === 'function' && w.isVersionAtLeast('6.1');
    if (canSetThemeColors) {
      try {
        w.setHeaderColor('#0f0f12');
        w.setBackgroundColor('#0f0f12');
      } catch {
        /* ignore */
      }
    }

    const initData = w.initData ?? '';
    const user = w.initDataUnsafe?.user ?? null;
    setState({ isTelegram: true, initData, user });
  }, []);

  return state;
}
