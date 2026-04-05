import express from 'express';
import cors from 'cors';
import { rollTap } from './rng.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/tap', (_req, res) => {
  const result = rollTap();
  res.json({
    id: result.id,
    rarity: result.rarity,
    label: result.label,
    message: result.message,
    approximateChance: result.approximateChance,
  });
});

app.listen(PORT, () => {
  console.log(`buttoff api http://localhost:${PORT}`);
});
