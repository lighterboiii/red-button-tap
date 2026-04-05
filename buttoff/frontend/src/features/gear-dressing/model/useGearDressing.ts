import { useCallback, useMemo, useState } from 'react';
import type { TapResult } from '@entities/outcome';
import {
  computeCombatStats,
  CRIT_FROM_TAPS_CAP,
  CRIT_TAP_DELTA,
  CRIT_TAP_PROC_CHANCE,
  resolveRandomBattle,
  resolveSparBattle,
  type BattleOutcome,
} from '@entities/combat';
import {
  GEAR_SLOTS,
  MAX_GEAR_DURABILITY,
  type GearItem,
  type GearSlot,
} from '@entities/gear';
import { loadGearDressing, saveGearDressing, type GearDressingStored } from './storage';

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useGearDressing() {
  const [state, setState] = useState<GearDressingStored>(() => loadGearDressing());
  const [lastBattle, setLastBattle] = useState<BattleOutcome | null>(null);

  const combatStats = useMemo(() => computeCombatStats(state.equipped), [state.equipped]);

  /** Только по кнопке «Взять» после тапа; «Пропустить» сюда не вызывается. */
  const applyTapDrop = useCallback(
    (result: TapResult) => {
      const { drop, rarity } = result;
      const item: GearItem = {
        id: newId(),
        slot: drop.slot,
        label: drop.label,
        rarity,
        durability: MAX_GEAR_DURABILITY,
        maxDurability: MAX_GEAR_DURABILITY,
      };
      setState((prev) => {
        let crit = prev.critChanceFromTaps;
        if (Math.random() < CRIT_TAP_PROC_CHANCE) {
          crit = Math.min(CRIT_FROM_TAPS_CAP, crit + CRIT_TAP_DELTA);
        }
        const next: GearDressingStored = {
          ...prev,
          inventory: [...prev.inventory, item],
          critChanceFromTaps: crit,
        };
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

  const runRandomBattle = useCallback(() => {
    setState((prev) => {
      for (const slot of GEAR_SLOTS) {
        if (!prev.equipped[slot]) return prev;
      }
      if (!GEAR_SLOTS.every((s) => (prev.equipped[s]?.durability ?? 0) >= 1)) return prev;

      const stats = computeCombatStats(prev.equipped);
      const outcome = resolveRandomBattle(stats, prev.critChanceFromTaps);
      queueMicrotask(() => setLastBattle(outcome));

      const equipped = { ...prev.equipped };
      for (const slot of GEAR_SLOTS) {
        const item = equipped[slot]!;
        const nextDur = item.durability - 1;
        if (nextDur <= 0) equipped[slot] = null;
        else equipped[slot] = { ...item, durability: nextDur };
      }
      const next: GearDressingStored = { ...prev, equipped };
      saveGearDressing(next);
      return next;
    });
  }, []);

  /** Манекен: без износа экипировки; достаточно надеть все слоты. */
  const runSparBattle = useCallback(() => {
    setState((prev) => {
      for (const slot of GEAR_SLOTS) {
        if (!prev.equipped[slot]) return prev;
      }

      const stats = computeCombatStats(prev.equipped);
      const outcome = resolveSparBattle(stats, prev.critChanceFromTaps);
      queueMicrotask(() => setLastBattle(outcome));
      return prev;
    });
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

  return {
    dayKey: state.dayKey,
    inventory: state.inventory,
    equipped: state.equipped,
    critChanceFromTaps: state.critChanceFromTaps,
    combatStats,
    applyTapDrop,
    equip,
    unequip,
    runRandomBattle,
    runSparBattle,
    isFullyEquipped,
    canBattle,
    canSpar,
    lastBattle,
    dismissLastBattle,
  };
}
