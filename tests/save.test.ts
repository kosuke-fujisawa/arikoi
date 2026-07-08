import { describe, expect, it } from "vitest";
import { createSaveData, restoreSaveData } from "../src/lib/story/save";
import { createInitialState, advance, choose } from "../src/lib/story/engine";
import { sampleStoryBundle } from "../src/lib/story/__fixtures__/sample-story-bundle";

function progressedState() {
  let state = createInitialState(sampleStoryBundle);
  for (let i = 0; i < 6; i++) {
    state = advance(state, sampleStoryBundle);
  }
  state = choose(state, sampleStoryBundle, "ask");
  return state;
}

describe("createSaveData", () => {
  it("現在の状態からSaveDataを生成する", () => {
    const state = progressedState();

    const saveData = createSaveData(state, sampleStoryBundle);

    expect(saveData.currentSceneId).toBe(state.currentSceneId);
    expect(saveData.currentStepId).toBe(state.currentStepId);
    expect(saveData.variables).toEqual(state.variables);
    expect(saveData.choiceHistory).toEqual(state.choiceHistory);
    expect(saveData.readStepIds).toEqual(state.readStepIds);
    expect(saveData.storyBuildId).toBe(sampleStoryBundle.storyBuildId);
    expect(saveData.storySchemaVersion).toBe(sampleStoryBundle.schemaVersion);
    expect(saveData.slotId).toBe("default");
  });

  it("slotId/appVersionを上書きできる", () => {
    const state = progressedState();

    const saveData = createSaveData(state, sampleStoryBundle, {
      appVersion: "1.2.3",
      slotId: "custom",
    });

    expect(saveData.appVersion).toBe("1.2.3");
    expect(saveData.slotId).toBe("custom");
  });
});

describe("restoreSaveData", () => {
  it("正常なSaveDataから状態を復元できる", () => {
    const state = progressedState();
    const saveData = createSaveData(state, sampleStoryBundle);

    const restored = restoreSaveData(saveData, sampleStoryBundle);

    expect(restored).toEqual({
      currentSceneId: state.currentSceneId,
      currentStepId: state.currentStepId,
      variables: state.variables,
      choiceHistory: state.choiceHistory,
      readStepIds: state.readStepIds,
    });
  });

  it("storyBuildIdが一致しない場合、例外を投げずValidationErrorを返す", () => {
    const state = progressedState();
    const saveData = createSaveData(state, sampleStoryBundle);
    const corrupted = { ...saveData, storyBuildId: "different-build" };

    const result = restoreSaveData(corrupted, sampleStoryBundle);

    expect(result).toEqual({
      code: "story-build-mismatch",
      message: expect.any(String),
    });
  });

  it("存在しないsceneIdを検出する", () => {
    const state = progressedState();
    const saveData = createSaveData(state, sampleStoryBundle);
    const corrupted = { ...saveData, currentSceneId: "no-such-scene" };

    const result = restoreSaveData(corrupted, sampleStoryBundle);

    expect(result).toEqual({ code: "unknown-scene", message: expect.any(String) });
  });

  it("存在しないstepIdを検出する", () => {
    const state = progressedState();
    const saveData = createSaveData(state, sampleStoryBundle);
    const corrupted = { ...saveData, currentStepId: "no-such-step" };

    const result = restoreSaveData(corrupted, sampleStoryBundle);

    expect(result).toEqual({ code: "unknown-step", message: expect.any(String) });
  });

  it("非対応のschemaVersionを検出する", () => {
    const state = progressedState();
    const saveData = createSaveData(state, sampleStoryBundle);
    const corrupted = { ...saveData, storySchemaVersion: "99.0.0" };

    const result = restoreSaveData(corrupted, sampleStoryBundle);

    expect(result).toEqual({
      code: "unsupported-schema-version",
      message: expect.any(String),
    });
  });

  it("形が壊れたデータ(不正な構造)でも例外を投げない", () => {
    const broken = { not: "a save data" };

    expect(() => restoreSaveData(broken as never, sampleStoryBundle)).not.toThrow();
    const result = restoreSaveData(broken as never, sampleStoryBundle);
    expect(result).toHaveProperty("code");
  });
});
