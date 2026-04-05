/** Форматирует мс в «Ч:ММ:СС». */
export function formatCooldownMs(ms: number) {
  if (ms <= 0) return '0:00:00';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
