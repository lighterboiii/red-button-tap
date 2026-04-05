# Buttoff

Монорепозиторий: фронт и бэк в **разных папках** — деплой каждой части отдельно.

- `frontend/` — React, TypeScript, [FSD](https://feature-sliced.design/): `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- `backend/` — Node.js (Express), `POST /api/tap` — взвешенный дроп редкости + текст.

## Локально

Терминал 1:

```bash
cd backend && npm install && npm run dev
```

Терминал 2:

```bash
cd frontend && npm install && npm run dev
```

Фронт проксирует `/api` на `localhost:3001`. Для продакшена задайте `VITE_API_URL` (URL бэкенда со схемой, без слэша в конце).

## Telegram (Mini App + бот)

1. Создай бота в [@BotFather](https://t.me/BotFather), возьми **токен**.
2. В BotFather: **Bot Settings → Menu Button** или **/newapp** — укажи URL фронта (HTTPS), где открывается это приложение.
3. В бэкенде скопируй `backend/.env.example` в `backend/.env`, вставь `TELEGRAM_BOT_TOKEN=...`.
4. Пока токен **не** задан, `POST /api/tap` и `GET /api/me` работают без Telegram (локальная разработка в браузере).
5. С токеном бэкенд проверяет подпись `initData` из [Telegram Web App](https://core.telegram.org/bots/webapps): фронт шлёт заголовок `Authorization: tma <initData>` (см. `frontend/src/shared/api/client.ts`).

**Локально без туннелей:** в `backend/.env` добавь `SKIP_TELEGRAM_AUTH=1` — API не требует `initData`, даже если `TELEGRAM_BOT_TOKEN` задан (удобно тыкать на `localhost`). В проде этот флаг **не включай**. Опционально `DEV_MOCK_TELEGRAM_USER_ID=123` для стабильного id в `/api/me`.

Аватар в «Персонаж» берётся из `photo_url` пользователя Mini App.

## Механика (база)

Каждый тап запрашивает исход на сервере: **обычное** чаще всего, **редкое** и **легендарное** — с низким шансом. В UI показывается приблизительный процент для выпавшей редкости, чтобы ожидание «прикола» было понятным.
