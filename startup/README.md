# XRABLE — лендинг (React + Vite)

Одностраничный лендинг XRABLE в стиле продуктовых сайтов Apple.  
Фронт — **React 18 + Vite**, компоненты лежат в `src/components/*`.

## Запуск

Требуется Node.js (LTS) и npm.

```bash
cd startup
npm install
npm run dev
```

Vite поднимет дев‑сервер (по умолчанию `http://localhost:5173`).

Сборка продакшн‑версии:

```bash
npm run build
npm run preview   # локальный просмотр сборки
```

## Структура

- `index.html` — точка входа Vite.
- `src/main.jsx` — подключение React‑приложения.
- `src/App.jsx` — сборка всех секций лендинга.
- `src/index.css` — глобальные стили, темы, типографика.
- `src/components/*` — изолированные блоки страницы:
  - `Hero`, `Problem`, `Solution`, `Benefits`, `Differentiation`,
  - `WhyNow`, `CaseSkadi`, `Team`, `CTA`, `Header`, `Footer`.

Каждый компонент в своей папке: `Component/Component.jsx` + `Component/Component.css`.

## Развитие

Можно добавлять новые секции по тому же паттерну, подключать реальные формы (отправка на backend), аналитику и анимации, не ломая общую структуру проекта.

