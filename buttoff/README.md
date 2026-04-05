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

## Механика (база)

Каждый тап запрашивает исход на сервере: **обычное** чаще всего, **редкое** и **легендарное** — с низким шансом. В UI показывается приблизительный процент для выпавшей редкости, чтобы ожидание «прикола» было понятным.
