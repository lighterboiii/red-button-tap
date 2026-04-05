import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { rollTap } from './rng.js';
import { rollDrop, SLOT_LABEL_RU } from './drops.js';
import { telegramAuthMiddleware } from './telegramMiddleware.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/** Профиль из Telegram после проверки initData (в браузере без бота — user: null) */
app.get('/api/me', telegramAuthMiddleware, (req, res) => {
  const u = req.telegramUser;
  res.json({
    ok: true,
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    user: u
      ? {
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          photo_url: u.photo_url,
        }
      : null,
  });
});

app.post('/api/tap', telegramAuthMiddleware, (_req, res) => {
  const result = rollTap();
  const drop = rollDrop(result.rarity);

  res.json({
    id: result.id,
    rarity: result.rarity,
    label: drop.label,
    message: SLOT_LABEL_RU[drop.slot],
    approximateChance: result.approximateChance,
    drop,
  });
});

app.listen(PORT, () => {
  console.log(`buttoff api http://localhost:${PORT}`);
});
