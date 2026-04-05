import type { ItemCombatStats } from '@entities/combat';
import { GEAR_SLOT_LABELS, SLOT_TILE_GLYPH, critPctShort, type GearItem, type GearSlot } from '@entities/gear';

function formatCritPct(crit: number): string {
  return `${(crit * 100).toFixed(1)}%`;
}

type Props = {
  slot: GearSlot;
  item: GearItem | null;
  stats: ItemCombatStats | null;
  /** Кнопка «снять» (персонаж) или только показ (вкладка «Кнопка») */
  interactive: boolean;
  /** Только при `interactive` */
  onUnequip?: () => void;
};

export function EquipTile({ slot, item, stats, interactive, onUnequip }: Props) {
  if (!item) {
    return (
      <div
        className="equip-tile equip-tile--vacant"
        title={GEAR_SLOT_LABELS[slot]}
        aria-label={`Пустой слот: ${GEAR_SLOT_LABELS[slot]}`}
      >
        <span className="equip-tile__icon equip-tile__icon--muted" aria-hidden>
          {SLOT_TILE_GLYPH[slot]}
        </span>
      </div>
    );
  }

  const title =
    stats != null
      ? `${item.label} · Атк ${stats.attack} / Защ ${stats.defense} / Крит ${formatCritPct(stats.critChance)} · ${item.durability}/${item.maxDurability}`
      : item.label;

  const aria =
    stats != null
      ? `${interactive ? 'Снять ' : ''}${item.label}. Атака ${stats.attack}, защита ${stats.defense}, крит ${formatCritPct(stats.critChance)}, прочность ${item.durability} из ${item.maxDurability}`
      : `${item.label}`;

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
      <span className="equip-tile__icon" aria-hidden>
        {SLOT_TILE_GLYPH[item.slot]}
      </span>
      <span className="equip-tile__dur" aria-hidden>
        {item.durability}/{item.maxDurability}
      </span>
    </>
  );

  const cls = `equip-tile equip-tile--${item.rarity}`;

  if (interactive) {
    return (
      <button
        type="button"
        className={cls}
        title={title}
        aria-label={aria}
        onClick={() => onUnequip?.()}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={cls} title={title} aria-label={aria}>
      {inner}
    </div>
  );
}
