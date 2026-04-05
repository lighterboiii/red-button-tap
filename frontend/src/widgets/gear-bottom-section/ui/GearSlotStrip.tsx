import type { ItemCombatStats } from '@entities/combat';
import { GEAR_SLOTS, GEAR_SLOT_LABELS, type GearItem, type GearSlot } from '@entities/gear';

type Props = {
  equipped: Record<GearSlot, GearItem | null>;
  itemStatsById: Record<string, ItemCombatStats>;
};

const SLOT_SHORT: Record<GearSlot, string> = {
  head: 'Г',
  sword: 'К',
  shield: 'Щ',
  shoulders: 'Пл',
  chest: 'Н',
};

export function GearSlotStrip({ equipped, itemStatsById }: Props) {
  return (
    <div className="gear-slot-strip" role="group" aria-label="Слоты экипировки">
      <ul className="gear-slot-strip__grid">
        {GEAR_SLOTS.map((slot) => {
          const item = equipped[slot];
          const filled = item != null;
          const stats = item ? itemStatsById[item.id] ?? null : null;
          const tip =
            item && stats
              ? `${GEAR_SLOT_LABELS[slot]}: ${item.label} · Атк ${stats.attack} Защ ${stats.defense} Крит ${(stats.critChance * 100).toFixed(0)}%`
              : GEAR_SLOT_LABELS[slot];
          return (
            <li key={slot} className="gear-slot-strip__cell-wrap">
              <div
                className={[
                  'gear-slot-strip__square',
                  filled ? `gear-slot-strip__square--${item.rarity}` : 'gear-slot-strip__square--empty',
                ].join(' ')}
                title={tip}
              >
                <span className="gear-slot-strip__abbr">{SLOT_SHORT[slot]}</span>
                {filled ? (
                  <span className="gear-slot-strip__dur" aria-hidden>
                    {item.durability}/{item.maxDurability}
                  </span>
                ) : (
                  <span className="gear-slot-strip__vacant" aria-hidden>
                    —
                  </span>
                )}
              </div>
              <span className="gear-slot-strip__caption">{GEAR_SLOT_LABELS[slot]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
