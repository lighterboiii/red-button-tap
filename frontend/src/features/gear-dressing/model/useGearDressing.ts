import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TapResult } from '@entities/outcome';
import type {
  BattleIntroState,
  BattleOutcome,
  CombatPreviewResponse,
  CombatStats,
  ItemCombatStats,
} from '@entities/combat';
import {
  GEAR_SLOTS,
  MAX_GEAR_DURABILITY,
  MAX_INVENTORY_SLOTS,
  type GearItem,
  type GearSlot,
} from '@entities/gear';
import { postBattle, postBattleOpponent, postCombatPreview } from '@shared/api/client';
import {
  CRIT_FROM_TAPS_CAP,
  CRIT_TAP_DELTA,
  CRIT_TAP_PROC_CHANCE,
} from './tapCritConstants';
import {
  XP_LOSS,
  XP_PER_TAP,
  XP_TAP_DAILY_CAP,
  XP_WIN_RANDOM,
  XP_WIN_SPAR,
  MAX_LEVEL,
  playerMaxHpFromLevel,
  xpToNextLevel,
} from '@entities/progression';
import { applyXpGrant, loadGearDressing, saveGearDressing, type GearDressingStored } from './storage';

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const EMPTY_STATS: CombatStats = { attack: 0, defense: 0, critFromGear: 0 };

function equipMatches(
  a: Record<GearSlot, GearItem | null>,
  b: Record<GearSlot, GearItem | null>,
): boolean {
  return GEAR_SLOTS.every((s) => a[s]?.id === b[s]?.id);
}

export function useGearDressing() {
  const [state, setState] = useState<GearDressingStored>(() => loadGearDressing());
  const [lastBattle, setLastBattle] = useState<BattleOutcome | null>(null);
  const [battleIntro, setBattleIntro] = useState<BattleIntroState | null>(null);
  const [preview, setPreview] = useState<CombatPreviewResponse | null>(null);
  const [battlePreparing, setBattlePreparing] = useState(false);
  const [battleCommitting, setBattleCommitting] = useState(false);

  const gearRef = useRef(state);
  const introRef = useRef<BattleIntroState | null>(null);
  const commitStartedRef = useRef(false);

  useEffect(() => {
    gearRef.current = state;
  }, [state]);

  useEffect(() => {
    introRef.current = battleIntro;
  }, [battleIntro]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const p = await postCombatPreview(state.equipped, state.inventory, state.critChanceFromTaps);
        if (!cancelled) setPreview(p);
      } catch {
        if (!cancelled) setPreview(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.equipped, state.inventory, state.critChanceFromTaps]);

  const combatStats = preview?.combatStats ?? EMPTY_STATS;
  const totalCritChance = preview?.totalCritChance ?? 0;
  const itemStatsById: Record<string, ItemCombatStats> = preview?.itemStatsById ?? {};

  /** Только по кнопке «Взять» после тапа; «Пропустить» сюда не вызывается. */
  const applyTapDrop = useCallback(
    (result: TapResult) => {
      setState((prev) => {
        if (prev.inventory.length >= MAX_INVENTORY_SLOTS) return prev;
        const { drop, rarity } = result;
        const item: GearItem = {
          id: newId(),
          slot: drop.slot,
          label: drop.label,
          rarity,
          durability: MAX_GEAR_DURABILITY,
          maxDurability: MAX_GEAR_DURABILITY,
        };
        let crit = prev.critChanceFromTaps;
        if (Math.random() < CRIT_TAP_PROC_CHANCE) {
          crit = Math.min(CRIT_FROM_TAPS_CAP, crit + CRIT_TAP_DELTA);
        }
        let next: GearDressingStored = {
          ...prev,
          inventory: [...prev.inventory, item],
          critChanceFromTaps: crit,
        };
        if (prev.tapXpDay < XP_TAP_DAILY_CAP) {
          next = applyXpGrant({ ...next, tapXpDay: prev.tapXpDay + XP_PER_TAP }, XP_PER_TAP);
        } else {
          next = { ...next, tapXpDay: prev.tapXpDay };
        }
        saveGearDressing(next);
        return next;
      });
    },
    [],
  );

  const equip = useCallback((itemId: string) => {
    setState((prev) => {
      const idx = prev.inventory.findIndex((i) => i.id === itemId);
      if (idx === -1) return prev;
      const item = prev.inventory[idx]!;
      const slot = item.slot;
      const inv = [...prev.inventory];
      inv.splice(idx, 1);
      const prevEq = prev.equipped[slot];
      if (prevEq) inv.push(prevEq);
      const next: GearDressingStored = {
        ...prev,
        inventory: inv,
        equipped: { ...prev.equipped, [slot]: item },
      };
      saveGearDressing(next);
      return next;
    });
  }, []);

  const unequip = useCallback((slot: GearSlot) => {
    setState((prev) => {
      const item = prev.equipped[slot];
      if (!item) return prev;
      const next: GearDressingStored = {
        ...prev,
        inventory: [...prev.inventory, item],
        equipped: { ...prev.equipped, [slot]: null },
      };
      saveGearDressing(next);
      return next;
    });
  }, []);

  const prepareRandomBattle = useCallback(async () => {
    const snap = gearRef.current;
    for (const slot of GEAR_SLOTS) {
      if (!snap.equipped[slot]) return;
    }
    if (!GEAR_SLOTS.every((s) => (snap.equipped[s]?.durability ?? 0) >= 1)) return;

    setBattlePreparing(true);
    try {
      const r = await postBattleOpponent({
        battleKind: 'random',
        equipped: snap.equipped,
        critChanceFromTaps: snap.critChanceFromTaps,
        level: snap.level,
      });
      setBattleIntro({
        battleKind: 'random',
        enemy: r.enemy,
        playerHp: r.playerHp,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setBattlePreparing(false);
    }
  }, []);

  const prepareSparBattle = useCallback(async () => {
    const snap = gearRef.current;
    for (const slot of GEAR_SLOTS) {
      if (!snap.equipped[slot]) return;
    }

    setBattlePreparing(true);
    try {
      const r = await postBattleOpponent({
        battleKind: 'spar',
        equipped: snap.equipped,
        critChanceFromTaps: snap.critChanceFromTaps,
        level: snap.level,
      });
      setBattleIntro({
        battleKind: 'spar',
        enemy: r.enemy,
        playerHp: r.playerHp,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setBattlePreparing(false);
    }
  }, []);

  const commitBattle = useCallback(async () => {
    if (commitStartedRef.current) return;
    const intro = introRef.current;
    if (!intro) return;

    commitStartedRef.current = true;
    setBattleIntro(null);
    setBattleCommitting(true);

    const { battleKind, enemy } = intro;
    const snap = gearRef.current;

    try {
      const { outcome } = await postBattle({
        battleKind,
        equipped: snap.equipped,
        critChanceFromTaps: snap.critChanceFromTaps,
        enemy,
        level: snap.level,
      });
      setLastBattle(outcome);

      const xpGain = outcome.won
        ? battleKind === 'random'
          ? XP_WIN_RANDOM
          : XP_WIN_SPAR
        : XP_LOSS;

      setState((cur) => {
        let next = applyXpGrant(cur, xpGain);
        if (battleKind === 'random' && equipMatches(cur.equipped, snap.equipped)) {
          const equipped = { ...next.equipped };
          for (const slot of GEAR_SLOTS) {
            const item = equipped[slot]!;
            const nextDur = item.durability - 1;
            if (nextDur <= 0) equipped[slot] = null;
            else equipped[slot] = { ...item, durability: nextDur };
          }
          next = { ...next, equipped };
        }
        saveGearDressing(next);
        return next;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setBattleCommitting(false);
      commitStartedRef.current = false;
    }
  }, []);

  const cancelBattleIntro = useCallback(() => {
    setBattleIntro(null);
  }, []);

  const dismissLastBattle = useCallback(() => setLastBattle(null), []);

  const isFullyEquipped = useMemo(
    () => GEAR_SLOTS.every((s) => state.equipped[s] != null),
    [state.equipped],
  );

  const canBattle = useMemo(() => {
    if (!isFullyEquipped) return false;
    return GEAR_SLOTS.every((s) => (state.equipped[s]?.durability ?? 0) >= 1);
  }, [isFullyEquipped, state.equipped]);

  const canSpar = isFullyEquipped;

  const inventoryFull = useMemo(
    () => state.inventory.length >= MAX_INVENTORY_SLOTS,
    [state.inventory.length],
  );

  const levelProgress = useMemo(() => {
    const atMaxLevel = state.level >= MAX_LEVEL;
    const need = xpToNextLevel(state.level);
    const xpProgress = atMaxLevel ? 1 : need > 0 ? state.xp / need : 0;
    return {
      level: state.level,
      xp: state.xp,
      xpToNext: atMaxLevel ? 0 : need,
      xpProgress,
      atMaxLevel,
      playerMaxHp: playerMaxHpFromLevel(state.level),
    };
  }, [state.level, state.xp]);

  return {
    dayKey: state.dayKey,
    ...levelProgress,
    inventory: state.inventory,
    inventoryFull,
    maxInventorySlots: MAX_INVENTORY_SLOTS,
    equipped: state.equipped,
    critChanceFromTaps: state.critChanceFromTaps,
    combatStats,
    totalCritChance,
    itemStatsById,
    applyTapDrop,
    equip,
    unequip,
    prepareRandomBattle,
    prepareSparBattle,
    battleIntro,
    battlePreparing,
    battleCommitting,
    commitBattle,
    cancelBattleIntro,
    isFullyEquipped,
    canBattle,
    canSpar,
    lastBattle,
    dismissLastBattle,
  };
}
