/**
 * Каталог предметов: фиксированные id, имена и поправки к базовым статам (редкость×слот).
 * Бижутерия — слот `jewelry`, эффекты обрабатываются в resolveBattle.js.
 */

/** @typedef {'common' | 'uncommon' | 'rare' | 'legendary'} ArmorRarity */
/** @typedef {'mercy' | 'crit_surge' | 'triad' | 'aegis'} JewelryEffect */

/**
 * @typedef {object} CatalogEntry
 * @property {string} id
 * @property {string} label
 * @property {import('./drops.js').GearSlot} slot
 * @property {ArmorRarity | 'legendary'} rarity
 * @property {number} atkDelta
 * @property {number} defDelta
 * @property {number} critDelta — добавка к critChance (не в процентах, 0.01 = 1%)
 * @property {JewelryEffect | null} [effect]
 */

/** @type {Record<string, CatalogEntry>} */
export const CATALOG_BY_ID = {};

function reg(e) {
  CATALOG_BY_ID[e.id] = e;
}

/* ─── 30 обычных (серые) — по 6 на слот, разные поправки ─── */
const C_HEAD = [
  ['cm_h1', 'Тряпичный капюшон', 0, 1, 0.001],
  ['cm_h2', 'Ветхий берет странника', -1, 2, 0.002],
  ['cm_h3', 'Кожаная шапка крестьянина', 0, 0, 0.003],
  ['cm_h4', 'Колпак подмастерья', 1, 0, 0.001],
  ['cm_h5', 'Шапка из грубой шерсти', -1, 1, 0.002],
  ['cm_h6', 'Убогий капор', 0, 2, 0],
];
const C_SWORD = [
  ['cm_s1', 'Деревянный тренировочный меч', 1, 0, 0.002],
  ['cm_s2', 'Ржавый кортик', 0, 0, 0.001],
  ['cm_s3', 'Клинок новичка', 2, -1, 0.001],
  ['cm_s4', 'Нож мясника', 0, 1, 0.002],
  ['cm_s5', 'Короткий клинок стража', 1, 0, 0.003],
  ['cm_s6', 'Сломанная сабля', -1, 0, 0.001],
];
const C_SHIELD = [
  ['cm_d1', 'Деревянный щит', 0, 1, 0.001],
  ['cm_d2', 'Потрёпанный баклер', -1, 2, 0],
  ['cm_d3', 'Крышка от бочки', 0, 1, 0.002],
  ['cm_d4', 'Обрубок досок', 1, 0, 0.001],
  ['cm_d5', 'Щит из кожи кабана', 0, 2, 0.001],
  ['cm_d6', 'Тарелка стражника', -1, 1, 0.002],
];
const C_SH = [
  ['cm_p1', 'Тканевые наплечники', 0, 1, 0.001],
  ['cm_p2', 'Кожаные лямки', 1, 0, 0.002],
  ['cm_p3', 'Ветхие наплечные ремни', -1, 1, 0.001],
  ['cm_p4', 'Наплечники из мешковины', 0, 0, 0.003],
  ['cm_p5', 'Грубые эполеты', 1, -1, 0.001],
  ['cm_p6', 'Лоскуты на плечи', 0, 2, 0],
];
const C_CH = [
  ['cm_c1', 'Грубая рубаха', 0, 1, 0.001],
  ['cm_c2', 'Кожаная безрукавка', 1, 1, 0.001],
  ['cm_c3', 'Льняная кольчуга', -1, 2, 0.002],
  ['cm_c4', 'Жилет торговца', 0, 0, 0.002],
  ['cm_c5', 'Рубаха с заплатами', 1, 0, 0.001],
  ['cm_c6', 'Поношенный камизоль', 0, 1, 0.003],
];

for (const [id, label, a, d, c] of C_HEAD) {
  reg({ id, label, slot: 'head', rarity: 'common', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of C_SWORD) {
  reg({ id, label, slot: 'sword', rarity: 'common', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of C_SHIELD) {
  reg({ id, label, slot: 'shield', rarity: 'common', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of C_SH) {
  reg({ id, label, slot: 'shoulders', rarity: 'common', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of C_CH) {
  reg({ id, label, slot: 'chest', rarity: 'common', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}

/* ─── 30 необычных (синие) ─── */
const U_HEAD = [
  ['uc_h1', 'Капюшон следопыта', 1, 2, 0.004],
  ['uc_h2', 'Железный обруч мага', 0, 3, 0.005],
  ['uc_h3', 'Шляпа учёного мага', 2, 1, 0.006],
  ['uc_h4', 'Капюшон теневого разведчика', 1, 1, 0.004],
  ['uc_h5', 'Обруч лесного стрелка', 0, 2, 0.005],
  ['uc_h6', 'Шляпа гильдии алхимиков', 2, 2, 0.005],
];
const U_SWORD = [
  ['uc_s1', 'Стальной короткий меч', 2, 0, 0.005],
  ['uc_s2', 'Секира лесника', 3, -1, 0.004],
  ['uc_s3', 'Кинжал охотника на демонов', 2, 1, 0.006],
  ['uc_s4', 'Клинок пограничника', 1, 0, 0.005],
  ['uc_s5', 'Сабля караванщика', 2, 0, 0.004],
  ['uc_s6', 'Рапира дуэлянта', 1, 1, 0.006],
];
const U_SHIELD = [
  ['uc_d1', 'Железный баклер', 0, 3, 0.004],
  ['uc_d2', 'Усиленный щит стража', 1, 3, 0.005],
  ['uc_d3', 'Щит гарнизона', 0, 4, 0.004],
  ['uc_d4', 'Башенный круглый щит', -1, 4, 0.005],
  ['uc_d5', 'Щит с гербом гильдии', 1, 2, 0.006],
  ['uc_d6', 'Тяжёлый павез', 0, 3, 0.005],
];
const U_SH = [
  ['uc_p1', 'Стальные наплечники', 1, 2, 0.005],
  ['uc_p2', 'Наплечи орка-наёмника', 2, 1, 0.004],
  ['uc_p3', 'Эполеты сержанта', 1, 3, 0.006],
  ['uc_p4', 'Наплечники следопыта', 0, 2, 0.005],
  ['uc_p5', 'Плечи кожи виверны', 2, 2, 0.005],
  ['uc_p6', 'Латы наплечья капитана', 1, 1, 0.004],
];
const U_CH = [
  ['uc_c1', 'Кольчужная рубаха', 1, 3, 0.005],
  ['uc_c2', 'Кожаный доспех разведчика', 2, 2, 0.004],
  ['uc_c3', 'Кираса гарнизона', 1, 4, 0.006],
  ['uc_c4', 'Хауберк странника', 0, 3, 0.005],
  ['uc_c5', 'Кожаный камизоль следопыта', 2, 3, 0.005],
  ['uc_c6', 'Кираса с гравировкой', 1, 2, 0.006],
];

for (const [id, label, a, d, c] of U_HEAD) {
  reg({ id, label, slot: 'head', rarity: 'uncommon', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of U_SWORD) {
  reg({ id, label, slot: 'sword', rarity: 'uncommon', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of U_SHIELD) {
  reg({ id, label, slot: 'shield', rarity: 'uncommon', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of U_SH) {
  reg({ id, label, slot: 'shoulders', rarity: 'uncommon', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}
for (const [id, label, a, d, c] of U_CH) {
  reg({ id, label, slot: 'chest', rarity: 'uncommon', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}

/* ─── 16 редких (фиолетовые) — 3+3+3+3+4 ─── */
const RA = [
  ['ra_h1', 'Шлем рыцаря ордена', 'head', 2, 4, 0.008],
  ['ra_h2', 'Диадема архимага', 'head', 1, 5, 0.01],
  ['ra_h3', 'Корона из палладия', 'head', 3, 3, 0.009],
  ['ra_s1', 'Клинок паладина', 'sword', 4, 0, 0.01],
  ['ra_s2', 'Правосудие закалённое', 'sword', 5, -1, 0.011],
  ['ra_s3', 'Меч стали и рун', 'sword', 3, 1, 0.009],
  ['ra_d1', 'Щит алого рассвета', 'shield', 1, 5, 0.008],
  ['ra_d2', 'Эгида стража стен', 'shield', 0, 6, 0.01],
  ['ra_d3', 'Башенный щит легиона', 'shield', 2, 4, 0.009],
  ['ra_p1', 'Наплечники драконьей чешуи', 'shoulders', 3, 3, 0.01],
  ['ra_p2', 'Плечи стража тьмы', 'shoulders', 2, 4, 0.009],
  ['ra_p3', 'Эполеты предводителя', 'shoulders', 4, 2, 0.011],
  ['ra_c1', 'Кираса закалённая', 'chest', 2, 5, 0.01],
  ['ra_c2', 'Латы командира', 'chest', 3, 4, 0.009],
  ['ra_c3', 'Рунический хауберк', 'chest', 1, 6, 0.01],
  ['ra_c4', 'Латы кровавого зари', 'chest', 4, 3, 0.012],
];

for (const [id, label, slot, a, d, c] of RA) {
  reg({ id, label, slot, rarity: 'rare', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}

/* ─── 10 легендарных (оружие/броня, не бижутерия) ─── */
const LG = [
  ['lg_h1', 'Корона королей древности', 'head', 4, 6, 0.014],
  ['lg_h2', 'Морозная корона', 'head', 3, 7, 0.015],
  ['lg_s1', 'Ледяная скорбь', 'sword', 8, 0, 0.016],
  ['lg_s2', 'Клинок предков', 'sword', 7, 1, 0.015],
  ['lg_d1', 'Щит героев прошлого', 'shield', 2, 8, 0.014],
  ['lg_d2', 'Эгида бессмертных', 'shield', 1, 9, 0.016],
  ['lg_p1', 'Наплечники титана', 'shoulders', 5, 5, 0.015],
  ['lg_p2', 'Хватка древних богов', 'shoulders', 6, 4, 0.016],
  ['lg_c1', 'Доспех вечности', 'chest', 4, 8, 0.017],
  ['lg_c2', 'Латы последнего стража', 'chest', 5, 7, 0.016],
];

for (const [id, label, slot, a, d, c] of LG) {
  reg({ id, label, slot, rarity: 'legendary', atkDelta: a, defDelta: d, critDelta: c, effect: null });
}

/* ─── 4 бижутерии (невероятно редкие эффекты) ─── */
reg({
  id: 'jw_mercy',
  label: 'Сердце эха заката — дар судьбы',
  slot: 'jewelry',
  rarity: 'legendary',
  atkDelta: 0,
  defDelta: 0,
  critDelta: 0.005,
  effect: 'mercy',
});
reg({
  id: 'jw_crit',
  label: 'Кольцо пророческого всплеска',
  slot: 'jewelry',
  rarity: 'legendary',
  atkDelta: 1,
  defDelta: 1,
  critDelta: 0.01,
  effect: 'crit_surge',
});
reg({
  id: 'jw_triad',
  label: 'Браслет трёх ударов крови',
  slot: 'jewelry',
  rarity: 'legendary',
  atkDelta: 2,
  defDelta: 0,
  critDelta: 0.008,
  effect: 'triad',
});
reg({
  id: 'jw_aegis',
  label: 'Подвеска неподвижной тени',
  slot: 'jewelry',
  rarity: 'legendary',
  atkDelta: 0,
  defDelta: 2,
  critDelta: 0.006,
  effect: 'aegis',
});

export const CATALOG_IDS = Object.keys(CATALOG_BY_ID);

/** @param {string} id */
export function getCatalogEntry(id) {
  return CATALOG_BY_ID[id] ?? null;
}

/** @param {ArmorRarity} rarity */
export function armorIdsForRarity(rarity) {
  return CATALOG_IDS.filter((id) => {
    const e = CATALOG_BY_ID[id];
    return e.slot !== 'jewelry' && e.rarity === rarity;
  });
}

export const JEWELRY_IDS = /** @type {const} */ (['jw_mercy', 'jw_crit', 'jw_triad', 'jw_aegis']);
