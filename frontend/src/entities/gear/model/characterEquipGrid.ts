import type { GearSlot } from './types';

/**
 * Имя области CSS Grid для каждого слота (см. `.character-panel__slots` в index.css).
 * Пустые клетки в разметке не рисуем — только свободные ячейки grid.
 *
 *   бижутерия · голова · наплечники  (справа вместо «второй» бижутерии — один слот наплечников)
 *   пусто · грудь · пусто
 *   меч · пусто · щит
 */
export const CHARACTER_SLOT_GRID_AREA: Record<GearSlot, string> = {
  jewelry: 'ch-jewelry',
  head: 'ch-head',
  shoulders: 'ch-shoulders',
  chest: 'ch-chest',
  sword: 'ch-sword',
  shield: 'ch-shield',
};
