import { useState } from 'react';
import { GEAR_SLOTS, GEAR_SLOT_LABELS, type GearItem, type GearSlot } from '@entities/gear';

type Props = {
  avatarUrl?: string | null;
  displayName?: string | null;
  gear: {
    inventory: GearItem[];
    equipped: Record<GearSlot, GearItem | null>;
    equip: (id: string) => void;
    unequip: (slot: GearSlot) => void;
    runBattle: () => void;
    canBattle: boolean;
  };
};

export function CharacterPanel({ gear, avatarUrl, displayName }: Props) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  const { inventory, equipped, equip, unequip, runBattle, canBattle } = gear;

  return (
    <section className="character-panel" aria-label="Персонаж">
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
                  title="Снять"
                >
                  <span className="character-panel__item-label">{item.label}</span>
                  <span className="character-panel__dur">
                    {item.durability}/{item.maxDurability}
                  </span>
                </button>
              ) : (
                <span className="character-panel__empty">—</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="character-panel__battle">
        <button
          type="button"
          className="character-panel__battle-btn"
          disabled={!canBattle}
          onClick={() => runBattle()}
        >
          Случайный бой
        </button>
      </div>

      <div className="character-panel__stash">
        <h2 className="character-panel__stash-title">Инвентарь</h2>
        {inventory.length === 0 ? (
          <p className="character-panel__stash-empty">—</p>
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
                    {item.durability}/{item.maxDurability}
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
