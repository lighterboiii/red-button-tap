/** Иконки слотов — см. `SlotTypeIcon` в `../ui/SlotTypeIcon.tsx` */

export function critPctShort(crit: number): string {
  const n = crit * 100;
  return n % 1 === 0 ? `${Math.round(n)}%` : `${n.toFixed(1)}%`;
}
