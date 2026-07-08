import type { SaveData } from "./story/types";

/**
 * SaveDataのlocalStorage読み書き。意図的にsrc/lib/story/(純粋なengine層)の外に置く。
 * スロットは単一デフォルトのみ(スロット選択UIは作らない)。
 */
const STORAGE_KEY = "arikoi:save:default";

export function readRawSaveData(): unknown | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeRawSaveData(saveData: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

export function clearRawSaveData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
