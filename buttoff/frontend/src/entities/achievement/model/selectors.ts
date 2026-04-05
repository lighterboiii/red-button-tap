import { ACHIEVEMENTS } from './definitions';
import type { AchievementProgress } from './types';

export function getUnlockedIds(p: AchievementProgress): Set<string> {
  const s = new Set<string>();
  for (const a of ACHIEVEMENTS) {
    if (a.isUnlocked(p)) s.add(a.id);
  }
  return s;
}

export function diffNewUnlocks(prev: AchievementProgress, next: AchievementProgress): string[] {
  const before = getUnlockedIds(prev);
  const after = getUnlockedIds(next);
  return [...after].filter((id) => !before.has(id));
}
