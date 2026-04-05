import type { AchievementDefinition } from './types';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'tap_1',
    category: 'tap',
    title: 'Первый тап',
    description: 'Один раз нажать — уже событие.',
    isUnlocked: (p) => p.lifetimeTaps >= 1,
  },
  {
    id: 'tap_10',
    category: 'tap',
    title: 'Десяточка',
    description: '10 успешных тапов.',
    isUnlocked: (p) => p.lifetimeTaps >= 10,
  },
  {
    id: 'tap_50',
    category: 'tap',
    title: 'Палец в тонусе',
    description: '50 тапов.',
    isUnlocked: (p) => p.lifetimeTaps >= 50,
  },
  {
    id: 'tap_100',
    category: 'tap',
    title: 'Сотня',
    description: '100 тапов — ты серьёзно.',
    isUnlocked: (p) => p.lifetimeTaps >= 100,
  },
  {
    id: 'visit_1',
    category: 'visit',
    title: 'Здравствуй',
    description: 'Первый заход в приложение.',
    isUnlocked: (p) => p.uniqueVisitDays >= 1,
  },
  {
    id: 'visit_3',
    category: 'visit',
    title: 'В гостях',
    description: 'Заходил в 3 разных дня.',
    isUnlocked: (p) => p.uniqueVisitDays >= 3,
  },
  {
    id: 'visit_7',
    category: 'visit',
    title: 'Неделя дней',
    description: '7 разных дней с заходом.',
    isUnlocked: (p) => p.uniqueVisitDays >= 7,
  },
  {
    id: 'streak_3',
    category: 'visit',
    title: 'Три дня подряд',
    description: 'Заходил 3 календарных дня подряд.',
    isUnlocked: (p) => p.bestVisitStreak >= 3,
  },
  {
    id: 'streak_7',
    category: 'visit',
    title: 'Неделя подряд',
    description: '7 дней подряд без пропуска.',
    isUnlocked: (p) => p.bestVisitStreak >= 7,
  },
];
