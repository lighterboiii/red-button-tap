import crypto from 'crypto';

/**
 * Валидация initData из Telegram Web App / Mini App.
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 * @param {string} initData — сырая строка query (как в window.Telegram.WebApp.initData)
 * @param {string} botToken — токен бота
 * @returns {boolean}
 */
export function verifyTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return false;
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;

    const authDate = Number(params.get('auth_date'));
    if (!Number.isFinite(authDate)) return false;
    /** Не старше 24 ч */
    if (Date.now() / 1000 - authDate > 86400) return false;

    params.delete('hash');
    const keys = [...params.keys()].sort((a, b) => a.localeCompare(b));
    const dataCheckString = keys.map((k) => `${k}=${params.get(k)}`).join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculated = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculated === hash;
  } catch {
    return false;
  }
}

/**
 * @param {string} initData
 * @returns {Record<string, unknown> | null}
 */
export function parseTelegramUserFromInitData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const raw = params.get('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
