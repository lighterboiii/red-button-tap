import type { ItemCombatStats } from '@entities/combat';
import { GEAR_SLOT_LABELS, SlotTypeIcon, critPctShort, type GearItem, type GearSlot } from '@entities/gear';

function formatCritPct(crit: number): string {
  return `${(crit * 100).toFixed(1)}%`;
}

export type EquipTileAction = 'unequip' | 'inspect';

type Props = {
  slot: GearSlot;
  item: GearItem | null;
  stats: ItemCombatStats | null;
  /** Плитка: снять слот / открыть карточку в инвентаре */
  onActivate?: () => void;
  /** Как озвучить кнопку для a11y */
  action?: EquipTileAction;
};

export function EquipTile({ slot, item, stats, onActivate, action = 'unequip' }: Props) {
  if (!item) {
    return (
      <div
        className="equip-tile equip-tile--vacant"
        title={GEAR_SLOT_LABELS[slot]}
        aria-label={`Пустой слот: ${GEAR_SLOT_LABELS[slot]}`}
      >
        <span className="equip-tile__icon equip-tile__icon--muted">
          <SlotTypeIcon slot={slot} className="equip-tile__icon-svg" />
        </span>
      </div>
    );
  }

  const title =
    stats != null
      ? `${item.label} · Атк ${stats.attack} / Защ ${stats.defense} / Крит ${formatCritPct(stats.critChance)} · ${item.durability}/${item.maxDurability}`
      : item.label;

  const ariaInspect =
    stats != null
      ? `Подробнее: ${item.label}. Слот ${GEAR_SLOT_LABELS[item.slot]}. Атака ${stats.attack}, защита ${stats.defense}, крит ${formatCritPct(stats.critChance)}, прочность ${item.durability} из ${item.maxDurability}`
      : `Подробнее: ${item.label}`;

  const ariaUnequip =
    stats != null
      ? `Снять ${item.label}. Атака ${stats.attack}, защита ${stats.defense}, крит ${formatCritPct(stats.critChance)}, прочность ${item.durability} из ${item.maxDurability}`
      : `Снять ${item.label}`;

  const aria = action === 'inspect' ? ariaInspect : ariaUnequip;

  const inner = (
    <>
      <span className="equip-tile__atk" aria-hidden>
        {stats ? stats.attack : '–'}
      </span>
      <span className="equip-tile__crit" aria-hidden>
        {stats ? critPctShort(stats.critChance) : '–'}
      </span>
      <span className="equip-tile__def" aria-hidden>
        {stats ? stats.defense : '–'}
      </span>
      <span className="equip-tile__icon">
        <SlotTypeIcon slot={item.slot} className="equip-tile__icon-svg" />
      </span>
      <span className="equip-tile__dur" aria-hidden>
        {item.durability}/{item.maxDurability}
      </span>
    </>
  );

  const cls = `equip-tile equip-tile--${item.rarity}`;

  if (onActivate) {
    return (
      <button type="button" className={cls} title={title} aria-label={aria} onClick={onActivate}>
        {inner}
      </button>
    );
  }

  return (
    <div className={cls} title={title} aria-label={title}>
      {inner}
    </div>
  );
}
