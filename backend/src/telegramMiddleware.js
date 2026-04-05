import { parseTelegramUserFromInitData, verifyTelegramInitData } from './telegramAuth.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';

const SKIP_TELEGRAM_AUTH = ['1', 'true', 'yes'].includes(
  String(process.env.SKIP_TELEGRAM_AUTH ?? '').toLowerCase(),
);

/** Фиктивный пользователь для локалки (браузер без Mini App). */
function mockLocalUser() {
  const id = Number(process.env.DEV_MOCK_TELEGRAM_USER_ID);
  return {
    id: Number.isFinite(id) && id > 0 ? id : 999001,
    first_name: 'Локалка',
    username: 'local_dev',
  };
}

/**
 * Достаёт initData из заголовков (как рекомендует Telegram: Authorization: tma … или X-Telegram-Init-Data).
 */
function getInitDataFromRequest(req) {
  const auth = req.headers.authorization;
  if (auth && /^tma\s+/i.test(auth)) {
    return auth.replace(/^tma\s+/i, '').trim();
  }
  const h = req.headers['x-telegram-init-data'];
  if (typeof h === 'string' && h.length > 0) return h;
  return '';
}

/**
 * Если TELEGRAM_BOT_TOKEN задан — требуем валидный initData.
 * Если токена нет — пропускаем (req.telegramUser = null).
 * SKIP_TELEGRAM_AUTH=1 — локальная разработка: токен может быть в .env, initData не нужен.
 */
export function telegramAuthMiddleware(req, res, next) {
  if (SKIP_TELEGRAM_AUTH) {
    req.telegramUser = mockLocalUser();
    req.telegramInitValid = false;
    return next();
  }

  if (!BOT_TOKEN) {
    req.telegramUser = null;
    req.telegramInitValid = false;
    return next();
  }

  const initData = getInitDataFromRequest(req);
  if (!initData) {
    return res.status(401).json({ error: 'telegram_init_data_required' });
  }

  if (!verifyTelegramInitData(initData, BOT_TOKEN)) {
    return res.status(401).json({ error: 'telegram_init_data_invalid' });
  }

  req.telegramUser = parseTelegramUserFromInitData(initData);
  req.telegramInitValid = true;
  next();
}
