import type { GearDrop } from '@entities/gear';
import type { Rarity } from './rarity';

export type { Rarity } from './rarity';

export type TapResult = {
  id: string;
  rarity: Rarity;
  label: string;
  message: string;
  approximateChance: number;
  /** Вещь с тапа (одна на тап, редкость как у исхода) */
  drop: GearDrop;
};
