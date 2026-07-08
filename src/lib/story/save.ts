import { SUPPORTED_SCHEMA_VERSIONS } from "./engine";
import type { SaveData, StoryBundle, ValidationError } from "./types";
import type { EngineState } from "./engine";

/**
 * セーブデータの生成・復元・検証。localStorageには直接アクセスしない
 * (読み書きはUI層のSaveLoadPanel.svelteが行う)。
 */

export function createSaveData(
  state: EngineState,
  bundle: StoryBundle,
  options?: { appVersion?: string; slotId?: string },
): SaveData {
  return {
    appVersion: options?.appVersion ?? "0.0.0",
    storySchemaVersion: bundle.schemaVersion,
    storyBuildId: bundle.storyBuildId,
    slotId: options?.slotId ?? "default",
    savedAt: new Date().toISOString(),
    currentSceneId: state.currentSceneId,
    currentStepId: state.currentStepId,
    variables: state.variables,
    choiceHistory: state.choiceHistory,
    readStepIds: state.readStepIds,
  };
}

function hasRequiredShape(value: unknown): value is SaveData {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.storySchemaVersion === "string" &&
    typeof v.storyBuildId === "string" &&
    typeof v.currentSceneId === "string" &&
    typeof v.currentStepId === "string" &&
    typeof v.variables === "object" &&
    v.variables !== null &&
    Array.isArray(v.choiceHistory) &&
    Array.isArray(v.readStepIds)
  );
}

export function restoreSaveData(
  saveData: unknown,
  bundle: StoryBundle,
): EngineState | ValidationError {
  if (!hasRequiredShape(saveData)) {
    return {
      code: "invalid-json",
      message: "SaveDataとして必要なフィールドが揃っていません",
    };
  }

  if (!SUPPORTED_SCHEMA_VERSIONS.includes(saveData.storySchemaVersion)) {
    return {
      code: "unsupported-schema-version",
      message: `unsupported SaveData storySchemaVersion: ${saveData.storySchemaVersion}`,
    };
  }

  if (saveData.storyBuildId !== bundle.storyBuildId) {
    return {
      code: "story-build-mismatch",
      message: `storyBuildId mismatch: save=${saveData.storyBuildId} bundle=${bundle.storyBuildId}`,
    };
  }

  const scene = bundle.scenes.find((s) => s.id === saveData.currentSceneId);
  if (!scene) {
    return {
      code: "unknown-scene",
      message: `unknown sceneId in SaveData: ${saveData.currentSceneId}`,
    };
  }

  const step = scene.steps.find((s) => s.id === saveData.currentStepId);
  if (!step) {
    return {
      code: "unknown-step",
      message: `unknown stepId in SaveData: ${saveData.currentStepId}`,
    };
  }

  return {
    currentSceneId: saveData.currentSceneId,
    currentStepId: saveData.currentStepId,
    variables: saveData.variables,
    choiceHistory: saveData.choiceHistory,
    readStepIds: saveData.readStepIds,
  };
}
