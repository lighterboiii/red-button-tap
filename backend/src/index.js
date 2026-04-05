import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { rollTap } from './rng.js';
import { rollDrop, SLOT_LABEL_RU } from './drops.js';
import { telegramAuthMiddleware } from './telegramMiddleware.js';
import { computeCombatStats, computeItemStatsMap } from './combat/computeStats.js';
import { TOTAL_CRIT_CAP } from './combat/constants.js';
import {
  applyBattleXp,
  parseProgression,
  progressionFromRequestBody,
  progressionSnapshot,
  applyTapTakeXp,
  playerMaxHpFromLevel,
} from './combat/progression.js';
import {
  isSparEnemy,
  isValidRandomEnemy,
  resolveBattleWithEnemy,
  rollEnemy,
  SPAR_OPPONENT,
} from './combat/resolveBattle.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

const GEAR_SLOTS = ['head', 'sword', 'shield', 'shoulders', 'chest'];

function sanitizeEquipped(raw) {
  const o = {};
  for (const s of GEAR_SLOTS) {
    const x = raw && raw[s];
    o[s] = x && typeof x === 'object' && x !== null && 'id' in x ? x : null;
  }
  return o;
}

function parseEnemy(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = raw.name;
  const hp = Number(raw.hp);
  const attack = Number(raw.attack);
  const defense = Number(raw.defense);
  if (typeof name !== 'string' || !Number.isFinite(hp) || !Number.isFinite(attack) || !Number.isFinite(defense)) {
    return null;
  }
  return { name, hp, attack, defense };
}

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

/** Нормализация и xpToNext / maxHp — только сервер */
app.post('/api/progression/sync', telegramAuthMiddleware, (req, res) => {
  try {
    const p = parseProgression(req.body?.progression);
    res.json(progressionSnapshot(p));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'progression_sync_failed' });
  }
});

/** Опыт за взятие дропа с тапа (лимит на день — по serverDayKey) */
app.post('/api/progression/tap-take', telegramAuthMiddleware, (req, res) => {
  try {
    const p = applyTapTakeXp(req.body?.progression);
    res.json(progressionSnapshot(p));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'progression_tap_take_failed' });
  }
});

/** Сводка статов и вкладов по вещам — расчёт на сервере */
app.post('/api/combat/preview', telegramAuthMiddleware, (req, res) => {
  try {
    const equipped = sanitizeEquipped(req.body?.equipped);
    const inventory = Array.isArray(req.body?.inventory) ? req.body.inventory : [];
    const crit = req.body?.critChanceFromTaps;
    const critChanceFromTaps =
      typeof crit === 'number' && Number.isFinite(crit) ? Math.min(1, Math.max(0, crit)) : 0;

    const combatStats = computeCombatStats(equipped);
    const totalCritChance = Math.min(TOTAL_CRIT_CAP, combatStats.critFromGear + critChanceFromTaps);

    const items = [...inventory];
    for (const s of GEAR_SLOTS) {
      const it = equipped[s];
      if (it && !items.some((x) => x?.id === it.id)) items.push(it);
    }
    const itemStatsById = computeItemStatsMap(items);
    res.json({ combatStats, totalCritChance, itemStatsById });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'preview_failed' });
  }
});

/** Противник перед боем (имя, статы) + твой макс. HP в этом бою */
app.post('/api/battle/opponent', telegramAuthMiddleware, (req, res) => {
  try {
    const battleKind = req.body?.battleKind;
    if (battleKind !== 'random' && battleKind !== 'spar') {
      return res.status(400).json({ error: 'battle_kind_invalid' });
    }
    const equipped = sanitizeEquipped(req.body?.equipped);

    for (const s of GEAR_SLOTS) {
      if (!equipped[s]) {
        return res.status(400).json({ error: 'slot_empty' });
      }
    }

    if (battleKind === 'random') {
      for (const s of GEAR_SLOTS) {
        if ((equipped[s].durability ?? 0) < 1) {
          return res.status(400).json({ error: 'durability_low' });
        }
      }
    }

    const p = progressionFromRequestBody(req.body);
    const playerHp = playerMaxHpFromLevel(p.level);
    const enemy = battleKind === 'spar' ? { ...SPAR_OPPONENT } : rollEnemy();

    res.json({ enemy, playerHp, ...progressionSnapshot(p) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'opponent_failed' });
  }
});

/** Результат боя — в теле обязателен тот же `enemy`, что выдали в /api/battle/opponent */
app.post('/api/battle', telegramAuthMiddleware, (req, res) => {
  try {
    const battleKind = req.body?.battleKind;
    if (battleKind !== 'random' && battleKind !== 'spar') {
      return res.status(400).json({ error: 'battle_kind_invalid' });
    }
    const equipped = sanitizeEquipped(req.body?.equipped);
    const crit = req.body?.critChanceFromTaps;
    const critChanceFromTaps =
      typeof crit === 'number' && Number.isFinite(crit) ? Math.min(1, Math.max(0, crit)) : 0;

    for (const s of GEAR_SLOTS) {
      if (!equipped[s]) {
        return res.status(400).json({ error: 'slot_empty' });
      }
    }

    if (battleKind === 'random') {
      for (const s of GEAR_SLOTS) {
        if ((equipped[s].durability ?? 0) < 1) {
          return res.status(400).json({ error: 'durability_low' });
        }
      }
    }

    const enemy = parseEnemy(req.body?.enemy);
    if (!enemy) {
      return res.status(400).json({ error: 'enemy_invalid' });
    }
    if (battleKind === 'spar') {
      if (!isSparEnemy(enemy)) {
        return res.status(400).json({ error: 'enemy_mismatch' });
      }
    } else if (!isValidRandomEnemy(enemy)) {
      return res.status(400).json({ error: 'enemy_mismatch' });
    }

    const pBefore = progressionFromRequestBody(req.body);
    const playerHp = playerMaxHpFromLevel(pBefore.level);
    const stats = computeCombatStats(equipped);
    const outcome = resolveBattleWithEnemy(stats, critChanceFromTaps, enemy, battleKind, playerHp);
    const pAfter = applyBattleXp(pBefore, outcome.won, battleKind);

    res.json({ outcome, ...progressionSnapshot(pAfter) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'battle_failed' });
  }
});

app.listen(PORT, () => {
  console.log(`buttoff api http://localhost:${PORT}`);
});
