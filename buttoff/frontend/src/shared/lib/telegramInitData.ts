/** Текущая строка initData для заголовков к API (в Telegram Mini App). */
export function getTelegramInitData(): string {
  if (typeof window === 'undefined') return '';
  return window.Telegram?.WebApp?.initData ?? '';
}
