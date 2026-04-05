/** Дефолтный порт бэка (`PORT` в `backend/.env`, иначе 3001 в `backend/src/index.js`) */
const LOCAL_BACKEND_ORIGIN = `http://localhost:${import.meta.env.VITE_API_PORT ?? '3001'}`;

function resolveApiBase(): string {
  const raw = import.meta.env.VITE_API_URL;
  const trimmed = typeof raw === 'string' ? raw.replace(/\/$/, '').trim() : '';
  if (trimmed !== '') return trimmed;
  if (import.meta.env.DEV) return LOCAL_BACKEND_ORIGIN;
  return '';
}

/**
 * База URL API (без слэша в конце).
 * - Задаётся `VITE_API_URL` в `frontend/.env` (тот же бэкенд, что в проде или другой стенд).
 * - В **dev**, если переменная пуста или не задана — `http://localhost:<порт>` (порт: `VITE_API_PORT` или 3001).
 * - В **prod** без `VITE_API_URL` — пустая строка → запросы на тот же хост, что и фронт (нужен `VITE_API_URL` на Vercel).
 */
export const API_BASE = resolveApiBase();

if (import.meta.env.PROD && typeof window !== 'undefined' && API_BASE === '') {
  console.warn(
    '[buttoff] Не задан VITE_API_URL. Запросы к /api уходят на тот же хост, что и фронт (на Vercel бэкенда нет → 404). Добавь URL бэкенда в Environment Variables и сделай redeploy.',
  );
}
