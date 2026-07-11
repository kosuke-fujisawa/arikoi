import { describe, expect, it } from "vitest";
import { getDebugInfo } from "../src/lib/story/selectors";
import { advance, choose, createInitialState } from "../src/lib/story/engine";
import { sampleStoryBundle } from "../src/lib/story/__fixtures__/sample-story-bundle";

describe("getDebugInfo", () => {
  it("現在のsceneId/stepId/source file/line/variables/choiceHistoryを返す", () => {
    const state = createInitialState(sampleStoryBundle);

    const info = getDebugInfo(state, sampleStoryBundle);

    expect(info).toEqual({
      storyBuildId: sampleStoryBundle.storyBuildId,
      sceneId: "prologue",
      stepId: "opening-narration",
      stepKind: "narration",
      sourceFile: "games/familiar-shape-of-love/scenario/en/prologue.md",
      sourceLine: 9,
      sourceColumn: undefined,
      readStepCount: 1,
      variables: {},
      choiceHistory: [],
    });
  });

  it("進行後は最新のsceneId/stepId/choiceHistoryを反映する", () => {
    let state = createInitialState(sampleStoryBundle);
    for (let i = 0; i < 6; i++) {
      state = advance(state, sampleStoryBundle);
    }
    state = choose(state, sampleStoryBundle, "ask");

    const info = getDebugInfo(state, sampleStoryBundle);

    expect(info.stepId).toBe("ask-protagonist-what");
    expect(info.choiceHistory).toHaveLength(1);
    expect(info.choiceHistory[0]).toMatchObject({
      stepId: "choice-ask-or-wait",
      choiceId: "ask",
    });
  });
});
