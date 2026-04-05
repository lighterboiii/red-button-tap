import type { Rarity } from '@entities/outcome/model/rarity';

/** Обязательные для боя слоты (без бижутерии). */
export const CORE_GEAR_SLOTS = ['head', 'sword', 'shield', 'chest', 'shoulders'] as const;
export type CoreGearSlot = (typeof CORE_GEAR_SLOTS)[number];

/** Порядок для полосы слотов: наплечники справа, бижутерия перед ними */
export const GEAR_SLOTS = ['head', 'sword', 'shield', 'chest', 'jewelry', 'shoulders'] as const;
export type GearSlot = (typeof GEAR_SLOTS)[number];

export const GEAR_SLOT_LABELS: Record<GearSlot, string> = {
  head: 'Голова',
  sword: 'Клинок',
  shield: 'Щит',
  shoulders: 'Наплечники',
  chest: 'Нагрудник',
  jewelry: 'Бижутерия',
};

export const MAX_GEAR_DURABILITY = 2;

/** Рюкзак: 3 ряда по 5 ячеек */
export const MAX_INVENTORY_SLOTS = 15;

export type GearItem = {
  id: string;
  slot: GearSlot;
  label: string;
  rarity: Rarity;
  durability: number;
  maxDurability: number;
  /** id из серверного каталога (статы с /api/combat/item-stats) */
  catalogId?: string;
};

export type GearDrop = {
  slot: GearSlot;
  label: string;
  catalogId: string;
};
