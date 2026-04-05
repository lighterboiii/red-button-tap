import type { ItemCombatStats } from '@entities/combat';
import { GEAR_SLOTS, type GearItem, type GearSlot } from '@entities/gear';
import { EquipTile } from '@widgets/gear-equip-tile';

type Props = {
  equipped: Record<GearSlot, GearItem | null>;
  itemStatsById: Record<string, ItemCombatStats>;
};

export function GearSlotStrip({ equipped, itemStatsById }: Props) {
  return (
    <div className="gear-slot-strip" role="group" aria-label="Экипировка">
      <ul className="gear-slot-strip__grid">
        {GEAR_SLOTS.map((slot) => {
          const item = equipped[slot];
          const stats = item ? itemStatsById[item.id] ?? null : null;
          return (
            <li key={slot} className="gear-slot-strip__cell">
              <EquipTile slot={slot} item={item} stats={stats} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
