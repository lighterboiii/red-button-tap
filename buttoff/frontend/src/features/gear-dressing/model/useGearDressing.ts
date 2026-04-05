import { useCallback, useMemo, useState } from 'react';
import type { TapResult } from '@entities/outcome';
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
        const next: GearDressingStored = {
          ...prev,
          inventory: [...prev.inventory, item],
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

  const runBattle = useCallback(() => {
    setState((prev) => {
      for (const slot of GEAR_SLOTS) {
        if (!prev.equipped[slot]) return prev;
      }
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

  const isFullyEquipped = useMemo(
    () => GEAR_SLOTS.every((s) => state.equipped[s] != null),
    [state.equipped],
  );

  const canBattle = useMemo(() => {
    if (!isFullyEquipped) return false;
    return GEAR_SLOTS.every((s) => (state.equipped[s]?.durability ?? 0) >= 1);
  }, [isFullyEquipped, state.equipped]);

  return {
    dayKey: state.dayKey,
    inventory: state.inventory,
    equipped: state.equipped,
    applyTapDrop,
    equip,
    unequip,
    runBattle,
    isFullyEquipped,
    canBattle,
  };
}
