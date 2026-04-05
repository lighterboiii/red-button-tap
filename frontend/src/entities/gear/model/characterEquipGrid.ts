import type { GearSlot } from './types';

/**
 * Имя области CSS Grid для каждого слота (см. `.character-panel__slots` в index.css).
 * Верхний ряд: бижутерия · голова · наплечники (правый верх — наплечники, не «вторая» бижутерия).
 */
export const CHARACTER_SLOT_GRID_AREA: Record<GearSlot, string> = {
  jewelry: 'ch-jewelry',
  head: 'ch-head',
  shoulders: 'ch-shoulders',
  chest: 'ch-chest',
  sword: 'ch-sword',
  shield: 'ch-shield',
};
