import type { Rarity } from '@entities/outcome/model/rarity';

export const GEAR_SLOTS = ['head', 'sword', 'shield', 'shoulders', 'chest'] as const;
export type GearSlot = (typeof GEAR_SLOTS)[number];

export const GEAR_SLOT_LABELS: Record<GearSlot, string> = {
  head: 'Голова',
  sword: 'Клинок',
  shield: 'Щит',
  shoulders: 'Наплечники',
  chest: 'Нагрудник',
};

export const MAX_GEAR_DURABILITY = 2;

export type GearItem = {
  id: string;
  slot: GearSlot;
  label: string;
  rarity: Rarity;
  durability: number;
  maxDurability: number;
};

export type GearDrop = {
  slot: GearSlot;
  label: string;
};
