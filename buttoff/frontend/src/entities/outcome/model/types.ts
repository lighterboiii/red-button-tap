export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type TapResult = {
  id: string;
  rarity: Rarity;
  label: string;
  message: string;
  approximateChance: number;
};
