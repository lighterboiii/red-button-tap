import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type {
  BattleIntroState,
  BattleLogFragment,
  BattleOutcome,
  BattleRoundLine,
  CombatStats,
  ItemCombatStats,
} from '@entities/combat';
import { RARITY_META } from '@entities/outcome';
import { GEAR_SLOTS, GEAR_SLOT_LABELS, MAX_INVENTORY_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { EquipTile } from '@widgets/gear-equip-tile';

/** Пауза перед первой строкой журнала — «заводится» бой */
const BATTLE_LOG_FIRST_MS = 480;
/** Между строками хода — видно развитие схватки */
const BATTLE_LOG_STEP_MS = 560;

/** Автостарт боя после экрана «встреча» */
const BATTLE_INTRO_AUTO_SEC = 10;

/** Векторное сердце (SVG), не эмодзи — для подписей HP */
function HpHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

type Props = {
  avatarUrl?: string | null;
  displayName?: string | null;
  gear: {
    inventory: GearItem[];
    equipped: Record<GearSlot, GearItem | null>;
    equip: (id: string) => void;
    unequip: (slot: GearSlot) => void;
    prepareRandomBattle: () => Promise<void>;
    prepareSparBattle: () => Promise<void>;
    battleIntro: BattleIntroState | null;
    battlePreparing: boolean;
    battleCommitting: boolean;
    commitBattle: () => Promise<void>;
    cancelBattleIntro: () => void;
    canBattle: boolean;
    canSpar: boolean;
    combatStats: CombatStats;
    totalCritChance: number;
    itemStatsById: Record<string, ItemCombatStats>;
    critChanceFromTaps: number;
    lastBattle: BattleOutcome | null;
    dismissLastBattle: () => void;
    level: number;
    xp: number;
    xpToNext: number;
    xpProgress: number;
    atMaxLevel: boolean;
    playerMaxHp: number;
  };
};

function formatCritPct(crit: number): string {
  return `${(crit * 100).toFixed(1)}%`;
}

function renderBattleLineFragments(line: BattleRoundLine): ReactNode {
  const fr = line.fragments;
  if (!fr?.length) return line.text;

  const side = line.side ?? 'neutral';

  return fr.map((f: BattleLogFragment, i: number) => {
    if (f.type === 'plain') {
      return <span key={i}>{f.text}</span>;
    }
    if (f.type === 'damage') {
      const dmgClass =
        side === 'player'
          ? 'character-panel__battle-log-dmg character-panel__battle-log-dmg--ally'
          : side === 'enemy'
            ? 'character-panel__battle-log-dmg character-panel__battle-log-dmg--foe'
            : 'character-panel__battle-log-dmg';
      return (
        <span key={i} className={dmgClass}>
          {f.value}
        </span>
      );
    }
    if (f.type === 'block') {
      return (
        <span key={i} className="character-panel__battle-log-block">
          {f.value}
        </span>
      );
    }
    if (f.type === 'hp') {
      return (
        <span key={i} className="character-panel__battle-log-hp">
          {f.value}
        </span>
      );
    }
    return null;
  });
}

export function CharacterPanel({ gear, avatarUrl, displayName }: Props) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  /** Сколько строк журнала боя уже показано (пошагово). */
  const [battleLogRevealed, setBattleLogRevealed] = useState(0);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<GearItem | null>(null);
  const [introCountdown, setIntroCountdown] = useState(BATTLE_INTRO_AUTO_SEC);
  const commitBattleRef = useRef(gear.commitBattle);
  commitBattleRef.current = gear.commitBattle;

  const {
    inventory,
    equipped,
    equip,
    unequip,
    prepareRandomBattle,
    prepareSparBattle,
    battleIntro,
    battlePreparing,
    battleCommitting,
    commitBattle,
    cancelBattleIntro,
    canBattle,
    canSpar,
    combatStats,
    totalCritChance,
    itemStatsById,
    critChanceFromTaps,
    lastBattle,
    dismissLastBattle,
    level,
    xp,
    xpToNext,
    xpProgress,
    atMaxLevel,
    playerMaxHp,
  } = gear;

  const totalCrit = totalCritChance;

  useEffect(() => {
    if (!lastBattle) {
      setBattleLogRevealed(0);
      return;
    }
    const n = lastBattle.rounds.length;
    if (n === 0) {
      setBattleLogRevealed(0);
      return;
    }
    setBattleLogRevealed(0);
    let cancelled = false;
    let count = 0;
    let tid: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      count += 1;
      setBattleLogRevealed(count);
      if (count < n) {
        tid = setTimeout(step, BATTLE_LOG_STEP_MS);
      }
    };

    tid = setTimeout(step, BATTLE_LOG_FIRST_MS);
    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [lastBattle]);

  useEffect(() => {
    if (!battleIntro) {
      setIntroCountdown(BATTLE_INTRO_AUTO_SEC);
      return;
    }
    let sec = BATTLE_INTRO_AUTO_SEC;
    setIntroCountdown(sec);
    const id = window.setInterval(() => {
      sec -= 1;
      setIntroCountdown(sec);
      if (sec <= 0) {
        window.clearInterval(id);
        void commitBattleRef.current();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [battleIntro]);

  useEffect(() => {
    if (!inventoryOpen && !detailItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (detailItem) setDetailItem(null);
        else setInventoryOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inventoryOpen, detailItem]);

  useEffect(() => {
    if (!inventoryOpen && !detailItem) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [inventoryOpen, detailItem]);

  const battleLogComplete =
    lastBattle != null && battleLogRevealed >= lastBattle.rounds.length;

  const introSpar = battleIntro?.battleKind === 'spar';

  return (
    <section className="character-panel" aria-label="Персонаж">
      <div className="character-panel__figure">
        {avatarUrl && !avatarBroken ? (
          <img
            className="character-panel__avatar"
            src={avatarUrl}
            alt={displayName ? `Аватар: ${displayName}` : 'Аватар'}
            width={112}
            height={112}
            decoding="async"
            onError={() => setAvatarBroken(true)}
          />
        ) : (
          <div className="character-panel__silhouette" aria-hidden />
        )}
      </div>

      <div className="character-panel__level-block" aria-label="Уровень и опыт">
        <div className="character-panel__level-row">
          <span className="character-panel__level-label">Уровень {level}</span>
          <span
            className="character-panel__level-hp-hint"
            title="Макс. HP в бою"
            aria-label={`Макс. HP в бою: ${playerMaxHp}`}
          >
            <HpHeartIcon className="character-panel__hp-heart" />
            <span className="character-panel__hp-hint-value">{playerMaxHp}</span>
          </span>
        </div>
        {atMaxLevel ? (
          <p className="character-panel__level-cap">Макс. уровень</p>
        ) : (
          <>
            <div
              className="character-panel__xp-bar"
              role="progressbar"
              aria-valuenow={xp}
              aria-valuemin={0}
              aria-valuemax={xpToNext}
              aria-label={`Опыт ${xp} из ${xpToNext}`}
            >
              <div
                className="character-panel__xp-bar-fill"
                style={{ width: `${Math.round(xpProgress * 100)}%` }}
              />
            </div>
            <p className="character-panel__xp-text">
              {xp} / {xpToNext} опыта
            </p>
          </>
        )}
      </div>

      <dl className="character-panel__stats" aria-label="Боевые характеристики">
        <div className="character-panel__stat">
          <dt>Атака</dt>
          <dd>{combatStats.attack}</dd>
        </div>
        <div className="character-panel__stat">
          <dt>Защита</dt>
          <dd>{combatStats.defense}</dd>
        </div>
        <div className="character-panel__stat character-panel__stat--crit">
          <dt>Крит</dt>
          <dd>
            <span className="character-panel__stat-value">{formatCritPct(totalCrit)}</span>
            <span className="character-panel__stat-split">
              {formatCritPct(combatStats.critFromGear)} экип. + {formatCritPct(critChanceFromTaps)} тапы
            </span>
          </dd>
        </div>
      </dl>

      <ul className="character-panel__slots">
        {GEAR_SLOTS.map((slot) => {
          const item = equipped[slot];
          const itemStats = item ? itemStatsById[item.id] ?? null : null;
          return (
            <li key={slot} className="character-panel__slot">
              <EquipTile
                slot={slot}
                item={item}
                stats={itemStats}
                onActivate={item ? () => unequip(slot) : undefined}
                action="unequip"
              />
            </li>
          );
        })}
      </ul>

      <div className="character-panel__battle">
        <div className="character-panel__battle-actions">
          <button
            type="button"
            className="character-panel__battle-btn"
            disabled={!canBattle || battlePreparing || Boolean(battleIntro)}
            onClick={() => void prepareRandomBattle()}
          >
            {battlePreparing && !battleIntro ? '…' : 'Случайный бой'}
          </button>
          <button
            type="button"
            className="character-panel__battle-btn character-panel__battle-btn--spar"
            disabled={!canSpar || battlePreparing || Boolean(battleIntro)}
            onClick={() => void prepareSparBattle()}
          >
            {battlePreparing && !battleIntro ? '…' : 'Тренировка'}
          </button>
        </div>
      </div>

      {battleIntro ? (
        <div
          className={`character-panel__battle-overlay character-panel__battle-overlay--intro ${
            introSpar ? 'character-panel__battle-overlay--spar' : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="character-panel-battle-intro-title"
        >
          <div
            className={[
              'character-panel__battle-intro-sheet',
              introSpar ? 'character-panel__battle-intro-sheet--spar' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {introSpar ? (
              <p className="character-panel__battle-ribbon" role="presentation">
                Тренировочный полигон
              </p>
            ) : null}
            <h3 id="character-panel-battle-intro-title" className="character-panel__battle-intro-heading">
              Перед боем
            </h3>
            <div className="character-panel__battle-intro-block">
              <p className="character-panel__battle-intro-label">Противник</p>
              <p className="character-panel__battle-intro-name">{battleIntro.enemy.name}</p>
              <dl className="character-panel__battle-intro-dl">
                <div>
                  <dt className="character-panel__battle-intro-dt-hp">
                    <HpHeartIcon className="character-panel__hp-heart character-panel__hp-heart--dt" />
                    HP
                  </dt>
                  <dd>{battleIntro.enemy.hp}</dd>
                </div>
                <div>
                  <dt>Атака</dt>
                  <dd>{battleIntro.enemy.attack}</dd>
                </div>
                <div>
                  <dt>Защита</dt>
                  <dd>{battleIntro.enemy.defense}</dd>
                </div>
              </dl>
            </div>
            <div className="character-panel__battle-intro-block character-panel__battle-intro-block--you">
              <p className="character-panel__battle-intro-label">Ты</p>
              <dl className="character-panel__battle-intro-dl">
                <div>
                  <dt className="character-panel__battle-intro-dt-hp">
                    <HpHeartIcon className="character-panel__hp-heart character-panel__hp-heart--dt" />
                    HP
                  </dt>
                  <dd>{battleIntro.playerHp}</dd>
                </div>
                <div>
                  <dt>Атака</dt>
                  <dd>{combatStats.attack}</dd>
                </div>
                <div>
                  <dt>Защита</dt>
                  <dd>{combatStats.defense}</dd>
                </div>
                <div>
                  <dt>Крит</dt>
                  <dd>{formatCritPct(totalCrit)}</dd>
                </div>
              </dl>
            </div>
            <p className="character-panel__battle-intro-timer" aria-live="polite">
              {introCountdown > 0 ? (
                <>
                  Автостарт через <strong>{introCountdown}</strong> с
                </>
              ) : (
                <>Начинаем…</>
              )}
            </p>
            <div className="character-panel__battle-intro-actions">
              <button
                type="button"
                className="character-panel__battle-intro-start"
                disabled={battleCommitting}
                onClick={() => void commitBattle()}
              >
                Начать бой
              </button>
              <button
                type="button"
                className="character-panel__battle-intro-cancel"
                disabled={battleCommitting}
                onClick={() => cancelBattleIntro()}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {lastBattle ? (
        <div
          className={`character-panel__battle-overlay ${
            lastBattle.battleKind === 'spar' ? 'character-panel__battle-overlay--spar' : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            battleLogComplete ? 'character-panel-battle-title' : 'character-panel-battle-live'
          }
        >
          <div
            className={[
              'character-panel__battle-sheet',
              lastBattle.battleKind === 'spar' ? 'character-panel__battle-sheet--spar' : '',
              battleLogComplete ? '' : 'character-panel__battle-sheet--playing',
              battleLogComplete
                ? lastBattle.won
                  ? 'character-panel__battle-sheet--outcome-win'
                  : 'character-panel__battle-sheet--outcome-loss'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {lastBattle.battleKind === 'spar' ? (
              <p className="character-panel__battle-ribbon" role="presentation">
                Тренировочный полигон
              </p>
            ) : null}
            {!battleLogComplete ? (
              <h3 id="character-panel-battle-live" className="character-panel__battle-live-title">
                Журнал боя
              </h3>
            ) : null}
            <ul className="character-panel__battle-log" aria-live="polite" aria-relevant="additions">
              {lastBattle.rounds.slice(0, battleLogRevealed).map((r, i) => {
                const side = r.side ?? 'neutral';
                return (
                  <li
                    key={`${lastBattle.enemy.name}-${r.round}-${i}`}
                    className={[
                      'character-panel__battle-log-line',
                      `character-panel__battle-log-line--${side}`,
                    ].join(' ')}
                    aria-label={r.text}
                  >
                    {renderBattleLineFragments(r)}
                  </li>
                );
              })}
            </ul>
            {!battleLogComplete ? (
              <p className="character-panel__battle-pulse" aria-hidden>
                <span className="character-panel__battle-pulse-dot" />
                Бой идёт
              </p>
            ) : null}
            {battleLogComplete ? (
              <div
                className={`character-panel__battle-result character-panel__battle-result--${
                  lastBattle.won ? 'win' : 'loss'
                }`}
              >
                <h3
                  id="character-panel-battle-title"
                  className={`character-panel__battle-title character-panel__battle-title--${
                    lastBattle.won ? 'win' : 'loss'
                  }`}
                >
                  {lastBattle.won ? 'Победа' : 'Поражение'}
                </h3>
                <p
                  className={`character-panel__battle-enemy character-panel__battle-enemy--${
                    lastBattle.won ? 'win' : 'loss'
                  }`}
                >
                  {lastBattle.enemy.name}
                </p>
                <p
                  className={`character-panel__battle-summary character-panel__battle-summary--${
                    lastBattle.won ? 'win' : 'loss'
                  }`}
                >
                  <span className="character-panel__battle-summary-hp">
                    <HpHeartIcon className="character-panel__hp-heart character-panel__hp-heart--summary" />
                    Твой HP: {lastBattle.playerHpStart} → {lastBattle.playerHpEnd}
                  </span>
                  {' · '}
                  <span className="character-panel__battle-summary-hp">
                    <HpHeartIcon className="character-panel__hp-heart character-panel__hp-heart--summary" />
                    {lastBattle.battleKind === 'spar' ? 'Манекен' : 'Враг'}: {lastBattle.enemyHpStart} →{' '}
                    {lastBattle.enemyHpEnd}
                  </span>
                </p>
              </div>
            ) : null}
            <button
              type="button"
              className="character-panel__battle-ok"
              disabled={!battleLogComplete}
              onClick={() => dismissLastBattle()}
            >
              Ок
            </button>
          </div>
        </div>
      ) : null}

      <div className="character-panel__inv-trigger-wrap">
        <button
          type="button"
          className="character-panel__inv-trigger"
          onClick={() => setInventoryOpen(true)}
        >
          Инвентарь
          <span className="character-panel__inv-trigger-badge">
            {inventory.length}/{MAX_INVENTORY_SLOTS}
          </span>
        </button>
      </div>

      {inventoryOpen
        ? createPortal(
            <>
              <button
                type="button"
                className="character-panel__inv-backdrop"
                aria-label="Закрыть инвентарь"
                onClick={() => setInventoryOpen(false)}
              />
              <div
                className="character-panel__inv-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="character-panel-inv-title"
              >
                <div className="character-panel__inv-sheet-head">
                  <h2 id="character-panel-inv-title" className="character-panel__inv-sheet-title">
                    Инвентарь
                  </h2>
                  <button
                    type="button"
                    className="character-panel__inv-sheet-close"
                    aria-label="Закрыть"
                    onClick={() => setInventoryOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="character-panel__inv-sheet-body">
                  <ul className="character-panel__inv-grid">
                    {Array.from({ length: MAX_INVENTORY_SLOTS }, (_, i) => {
                      const item = inventory[i] ?? null;
                      if (!item) {
                        return (
                          <li key={`inv-cell-${i}`} className="character-panel__inv-grid-cell">
                            <div className="equip-tile equip-tile--inv-empty" aria-hidden />
                          </li>
                        );
                      }
                      const s = itemStatsById[item.id] ?? null;
                      return (
                        <li key={item.id} className="character-panel__inv-grid-cell">
                          <EquipTile
                            slot={item.slot}
                            item={item}
                            stats={s}
                            onActivate={() => setDetailItem(item)}
                            action="inspect"
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}

      {detailItem
        ? createPortal(
            <>
              <button
                type="button"
                className="character-panel__item-detail-backdrop"
                aria-label="Закрыть"
                onClick={() => setDetailItem(null)}
              />
              <div
                className={`character-panel__item-detail character-panel__item-detail--${detailItem.rarity}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="character-panel-item-detail-title"
              >
                <h3 id="character-panel-item-detail-title" className="character-panel__item-detail-name">
                  {detailItem.label}
                </h3>
                <p className="character-panel__item-detail-rarity">{RARITY_META[detailItem.rarity].title}</p>
                <dl className="character-panel__item-detail-dl">
                  <div>
                    <dt>Слот</dt>
                    <dd>{GEAR_SLOT_LABELS[detailItem.slot]}</dd>
                  </div>
                  <div>
                    <dt>Прочность</dt>
                    <dd>
                      {detailItem.durability}/{detailItem.maxDurability}
                    </dd>
                  </div>
                  {itemStatsById[detailItem.id] ? (
                    <>
                      <div>
                        <dt>Атака</dt>
                        <dd>{itemStatsById[detailItem.id]!.attack}</dd>
                      </div>
                      <div>
                        <dt>Защита</dt>
                        <dd>{itemStatsById[detailItem.id]!.defense}</dd>
                      </div>
                      <div>
                        <dt>Крит</dt>
                        <dd>{formatCritPct(itemStatsById[detailItem.id]!.critChance)}</dd>
                      </div>
                    </>
                  ) : null}
                </dl>
                <div className="character-panel__item-detail-actions">
                  <button
                    type="button"
                    className="character-panel__item-detail-equip"
                    onClick={() => {
                      equip(detailItem.id);
                      setDetailItem(null);
                      setInventoryOpen(false);
                    }}
                  >
                    Надеть
                  </button>
                  <button
                    type="button"
                    className="character-panel__item-detail-close"
                    onClick={() => setDetailItem(null)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </section>
  );
}
