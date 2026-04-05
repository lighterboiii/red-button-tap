import type { GearSlot } from './types';

/** Как в backend/src/itemCatalog.js — эффекты бижутерии в бою (resolveBattle / computeStats). */
export type JewelryEffectId = 'mercy' | 'crit_surge' | 'triad' | 'aegis';

/** Совпадает с легендарными записями в backend/src/itemCatalog.js — дельты к базовым статам. */
export type ForgeLegendaryPreview = {
  catalogId: string;
  label: string;
  slot: GearSlot;
  atkDelta: number;
  defDelta: number;
  /** Как в каталоге: 0.01 = 1% к шансу крита */
  critDelta: number;
  /** Только для бижутерии */
  effect?: JewelryEffectId;
};

/** Тексты для окна превью в кузне (механика с бэкенда). */
export const JEWELRY_EFFECT_DESCRIPTION: Record<JewelryEffectId, string> = {
  mercy:
    'Перед началом боя есть шанс ~2,5%, что «дар судьбы» завершит сражение мгновенно в твою пользу.',
  crit_surge:
    'Добавляет к итоговому шансу критического удара в бою плоский бонус +25% (с учётом общего лимита).',
  triad: 'В твоём раунде ты наносишь до трёх ударов подряд вместо одного.',
  aegis: 'При ударе врага есть шанс ~22% полностью отменить полученный урон.',
};

export function forgePreviewJewelryEffectText(entry: ForgeLegendaryPreview): string | null {
  if (entry.slot !== 'jewelry' || !entry.effect) return null;
  return JEWELRY_EFFECT_DESCRIPTION[entry.effect] ?? null;
}

export const FORGE_LEGENDARY_PREVIEW: readonly ForgeLegendaryPreview[] = [
  { catalogId: 'lg_h1', label: 'Корона королей древности', slot: 'head', atkDelta: 4, defDelta: 6, critDelta: 0.014 },
  { catalogId: 'lg_h2', label: 'Морозная корона', slot: 'head', atkDelta: 3, defDelta: 7, critDelta: 0.015 },
  { catalogId: 'lg_s1', label: 'Ледяная скорбь', slot: 'sword', atkDelta: 8, defDelta: 0, critDelta: 0.016 },
  { catalogId: 'lg_s2', label: 'Клинок предков', slot: 'sword', atkDelta: 7, defDelta: 1, critDelta: 0.015 },
  { catalogId: 'lg_d1', label: 'Щит героев прошлого', slot: 'shield', atkDelta: 2, defDelta: 8, critDelta: 0.014 },
  { catalogId: 'lg_d2', label: 'Эгида бессмертных', slot: 'shield', atkDelta: 1, defDelta: 9, critDelta: 0.016 },
  { catalogId: 'lg_p1', label: 'Наплечники титана', slot: 'shoulders', atkDelta: 5, defDelta: 5, critDelta: 0.015 },
  { catalogId: 'lg_p2', label: 'Хватка древних богов', slot: 'shoulders', atkDelta: 6, defDelta: 4, critDelta: 0.016 },
  { catalogId: 'lg_c1', label: 'Доспех вечности', slot: 'chest', atkDelta: 4, defDelta: 8, critDelta: 0.017 },
  { catalogId: 'lg_c2', label: 'Латы последнего стража', slot: 'chest', atkDelta: 5, defDelta: 7, critDelta: 0.016 },
  {
    catalogId: 'jw_mercy',
    label: 'Сердце эха заката — дар судьбы',
    slot: 'jewelry',
    atkDelta: 0,
    defDelta: 0,
    critDelta: 0.005,
    effect: 'mercy',
  },
  {
    catalogId: 'jw_crit',
    label: 'Кольцо пророческого всплеска',
    slot: 'jewelry',
    atkDelta: 1,
    defDelta: 1,
    critDelta: 0.01,
    effect: 'crit_surge',
  },
  {
    catalogId: 'jw_triad',
    label: 'Браслет трёх ударов крови',
    slot: 'jewelry',
    atkDelta: 2,
    defDelta: 0,
    critDelta: 0.008,
    effect: 'triad',
  },
  {
    catalogId: 'jw_aegis',
    label: 'Подвеска неподвижной тени',
    slot: 'jewelry',
    atkDelta: 0,
    defDelta: 2,
    critDelta: 0.006,
    effect: 'aegis',
  },
];
