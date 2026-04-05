import { GEAR_SLOTS, GEAR_SLOT_LABELS, type GearItem, type GearSlot } from '@entities/gear';

type Props = {
  equipped: Record<GearSlot, GearItem | null>;
};

const SLOT_SHORT: Record<GearSlot, string> = {
  head: 'Г',
  sword: 'К',
  shield: 'Щ',
  shoulders: 'Пл',
  chest: 'Н',
};

export function GearSlotStrip({ equipped }: Props) {
  return (
    <div className="gear-slot-strip" role="group" aria-label="Слоты экипировки">
      <ul className="gear-slot-strip__grid">
        {GEAR_SLOTS.map((slot) => {
          const item = equipped[slot];
          const filled = item != null;
          return (
            <li key={slot} className="gear-slot-strip__cell-wrap">
              <div
                className={[
                  'gear-slot-strip__square',
                  filled ? `gear-slot-strip__square--${item.rarity}` : 'gear-slot-strip__square--empty',
                ].join(' ')}
                title={GEAR_SLOT_LABELS[slot]}
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
