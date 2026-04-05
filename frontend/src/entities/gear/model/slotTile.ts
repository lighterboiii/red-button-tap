import type { GearSlot } from './types';

/** Глиф типа слота в центре плитки */
export const SLOT_TILE_GLYPH: Record<GearSlot, string> = {
  head: '⛑',
  sword: '⚔',
  shield: '🛡',
  shoulders: '◇',
  chest: '◆',
  jewelry: '✧',
};

export function critPctShort(crit: number): string {
  const n = crit * 100;
  return n % 1 === 0 ? `${Math.round(n)}%` : `${n.toFixed(1)}%`;
}
