import type { SaveData, StoryBundle, ValidationError } from "./types";
import type { EngineState } from "./engine";

/**
 * セーブデータの生成・復元・検証。localStorageには直接アクセスしない
 * (読み書きはUI層のSaveLoadPanel.svelteが行う)。
 *
 * 実装は#31で行う。
 */

export function createSaveData(
  _state: EngineState,
  _bundle: StoryBundle,
  _options?: { appVersion?: string; slotId?: string },
): SaveData {
  throw new Error("not implemented: see issue #31");
}

export function restoreSaveData(
  _saveData: SaveData,
  _bundle: StoryBundle,
): EngineState | ValidationError {
  throw new Error("not implemented: see issue #31");
}
