export type AchievementCategory = 'tap' | 'visit';

export type AchievementDefinition = {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  /** Выполнено при данном снимке прогресса */
  isUnlocked: (p: AchievementProgress) => boolean;
};

/** Только метрики; разблокировки считаются из определений */
export type AchievementProgress = {
  v: 1;
  /** Успешные тапы (ответ API), включая endless */
  lifetimeTaps: number;
  /** Сколько разных календарных дней был заход в приложение */
  uniqueVisitDays: number;
  lastVisitDay: string | null;
  /** Текущая серия календарных дней подряд */
  visitStreak: number;
  /** Максимум серии за всё время */
  bestVisitStreak: number;
};
