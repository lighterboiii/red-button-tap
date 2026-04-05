import { useState } from 'react';
import { GEAR_SLOTS, GEAR_SLOT_LABELS, type GearItem, type GearSlot } from '@entities/gear';
import { RARITY_META } from '@entities/outcome';

type Props = {
  /** Аватар из Telegram (photo_url); без Telegram — заглушка */
  avatarUrl?: string | null;
  displayName?: string | null;
  gear: {
    inventory: GearItem[];
    equipped: Record<GearSlot, GearItem | null>;
    equip: (id: string) => void;
    unequip: (slot: GearSlot) => void;
    runBattle: () => void;
    canBattle: boolean;
    lastTaunt: string | null;
    dismissTaunt: () => void;
    isFullyEquipped: boolean;
  };
};

function rarityTitle(r: GearItem['rarity']): string {
  const t = RARITY_META[r].title;
  return t || 'Обычное';
}

export function CharacterPanel({ gear, avatarUrl, displayName }: Props) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  const { inventory, equipped, equip, unequip, runBattle, canBattle, lastTaunt, dismissTaunt, isFullyEquipped } =
    gear;

  return (
    <section className="character-panel" aria-label="Персонаж">
      <p className="character-panel__intro">
        Каждый день сет сбрасывается — снова фарми вещи и одень голову, меч, щит, плечи и грудь. Полный сет: доступен
        случайный бой. Каждый бой тратит 1 прочность с каждой вещи (2/2).
      </p>

      <div className="character-panel__figure">
        {avatarUrl && !avatarBroken ? (
          <img
            className="character-panel__avatar"
            src={avatarUrl}
            alt={displayName ? `Аватар: ${displayName}` : 'Аватар'}
            width={112}
            height={144}
            decoding="async"
            onError={() => setAvatarBroken(true)}
          />
        ) : (
          <div className="character-panel__silhouette" aria-hidden />
        )}
      </div>

      <ul className="character-panel__slots">
        {GEAR_SLOTS.map((slot) => {
          const item = equipped[slot];
          return (
            <li key={slot} className="character-panel__slot">
              <span className="character-panel__slot-name">{GEAR_SLOT_LABELS[slot]}</span>
              {item ? (
                <button
                  type="button"
                  className={`character-panel__item character-panel__item--${item.rarity}`}
                  onClick={() => unequip(slot)}
                  title="Снять в рюкзак"
                >
                  <span className="character-panel__item-label">{item.label}</span>
                  <span className="character-panel__dur">
                    {item.durability}/{item.maxDurability}
                  </span>
                </button>
              ) : (
                <span className="character-panel__empty">пусто</span>
              )}
            </li>
          );
        })}
      </ul>

      {isFullyEquipped ? (
        <p className="character-panel__ready">Сет собран — можно в бой.</p>
      ) : (
        <p className="character-panel__hint">Докинь все 5 слотов, чтобы открыть «Случайный бой».</p>
      )}

      <div className="character-panel__battle">
        <button
          type="button"
          className="character-panel__battle-btn"
          disabled={!canBattle}
          onClick={() => runBattle()}
        >
          Случайный бой
        </button>
        {!canBattle && isFullyEquipped ? (
          <p className="character-panel__battle-note">Почини сет — у каждой вещи нужна хотя бы 1 прочность.</p>
        ) : null}
      </div>

      {lastTaunt ? (
        <div className="character-panel__taunt" role="status">
          <p className="character-panel__taunt-text">{lastTaunt}</p>
          <button type="button" className="character-panel__taunt-close" onClick={dismissTaunt}>
            Ок
          </button>
        </div>
      ) : null}

      <div className="character-panel__stash">
        <h2 className="character-panel__stash-title">Рюкзак</h2>
        {inventory.length === 0 ? (
          <p className="character-panel__stash-empty">Пусто — тапай, чтобы лутать.</p>
        ) : (
          <ul className="character-panel__stash-list">
            {inventory.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`character-panel__stash-chip character-panel__stash-chip--${item.rarity}`}
                  onClick={() => equip(item.id)}
                >
                  <span className="character-panel__stash-slot">{GEAR_SLOT_LABELS[item.slot]}</span>
                  <span className="character-panel__stash-label">{item.label}</span>
                  <span className="character-panel__stash-meta">
                    {rarityTitle(item.rarity)} · {item.durability}/{item.maxDurability}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
