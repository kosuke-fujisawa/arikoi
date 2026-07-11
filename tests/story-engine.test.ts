import { describe, expect, it } from "vitest";
import {
  advance,
  choose,
  createInitialState,
  getCurrentView,
  validateStoryBundle,
} from "../src/lib/story/engine";
import { sampleStoryBundle } from "../src/lib/story/__fixtures__/sample-story-bundle";
import type { StoryBundle } from "../src/lib/story/types";

function bundleWithScene(steps: StoryBundle["scenes"][number]["steps"]): StoryBundle {
  return {
    schemaVersion: "0.1.0",
    storyBuildId: "test-build",
    title: "Test",
    entrySceneId: "scene-1",
    assets: [],
    scenes: [
      {
        id: "scene-1",
        title: "Scene 1",
        steps,
        source: { file: "test.md", line: 1 },
      },
    ],
  };
}

const src = { file: "test.md", line: 1 };

describe("validateStoryBundle", () => {
  it("対応済みのschemaVersionならnullを返す", () => {
    const bundle = bundleWithScene([
      { kind: "narration", id: "n1", text: "hello", source: src },
    ]);

    expect(validateStoryBundle(bundle)).toBeNull();
  });

  it("未対応のschemaVersionならValidationErrorを返す(クラッシュしない)", () => {
    const bundle: StoryBundle = {
      ...bundleWithScene([
        { kind: "narration", id: "n1", text: "hello", source: src },
      ]),
      schemaVersion: "99.0.0",
    };

    const result = validateStoryBundle(bundle);

    expect(result).toEqual({
      code: "unsupported-schema-version",
      message: expect.stringContaining("99.0.0"),
    });
  });

  it("storyBuildIdが無い場合ValidationErrorを返す", () => {
    const bundle = {
      ...bundleWithScene([{ kind: "narration", id: "n1", text: "hello", source: src }]),
      storyBuildId: "",
    };

    expect(validateStoryBundle(bundle)).toEqual({
      code: "missing-story-build-id",
      message: expect.any(String),
    });
  });

  it("entrySceneIdに対応するsceneが無い場合ValidationErrorを返す", () => {
    const bundle = {
      ...bundleWithScene([{ kind: "narration", id: "n1", text: "hello", source: src }]),
      entrySceneId: "no-such-scene",
    };

    expect(validateStoryBundle(bundle)).toEqual({
      code: "unknown-entry-scene",
      message: expect.stringContaining("no-such-scene"),
    });
  });

  it("scene idが重複している場合ValidationErrorを返す", () => {
    const bundle = bundleWithScene([{ kind: "narration", id: "n1", text: "hello", source: src }]);
    const duplicated: StoryBundle = {
      ...bundle,
      scenes: [...bundle.scenes, ...bundle.scenes],
    };

    expect(validateStoryBundle(duplicated)).toEqual({
      code: "duplicate-scene-id",
      message: expect.stringContaining("scene-1"),
    });
  });

  it("stepにsource locationが無い場合ValidationErrorを返す", () => {
    const bundle = bundleWithScene([
      { kind: "narration", id: "n1", text: "hello", source: undefined },
    ] as unknown as StoryBundle["scenes"][number]["steps"]);

    expect(validateStoryBundle(bundle)).toEqual({
      code: "missing-source-location",
      message: expect.stringContaining("n1"),
    });
  });

  it("stepの構造が不正な場合(dialogueにtextが無い)ValidationErrorを返す", () => {
    const bundle = bundleWithScene([
      { kind: "dialogue", id: "d1", speaker: "kaede", source: src },
    ] as unknown as StoryBundle["scenes"][number]["steps"]);

    expect(validateStoryBundle(bundle)).toEqual({
      code: "invalid-step",
      message: expect.stringContaining("d1"),
    });
  });

  it("jumpのtargetStepIdが存在しない場合ValidationErrorを返す", () => {
    const bundle = bundleWithScene([
      { kind: "jump", id: "j1", targetStepId: "no-such-step", source: src },
    ]);

    expect(validateStoryBundle(bundle)).toEqual({
      code: "unknown-target-step",
      message: expect.stringContaining("no-such-step"),
    });
  });

  it("choiceのoptionのtargetStepIdが存在しない場合ValidationErrorを返す", () => {
    const bundle = bundleWithScene([
      {
        kind: "choice",
        id: "c1",
        options: [{ id: "a", label: "A", targetStepId: "no-such-step" }],
        source: src,
      },
    ]);

    expect(validateStoryBundle(bundle)).toEqual({
      code: "unknown-target-step",
      message: expect.stringContaining("no-such-step"),
    });
  });
});

describe("createInitialState", () => {
  it("エントリシーンの最初のrenderable stepを指す状態を作る", () => {
    const bundle = bundleWithScene([
      { kind: "narration", id: "n1", text: "hello", source: src },
    ]);

    const state = createInitialState(bundle);

    expect(state.currentSceneId).toBe("scene-1");
    expect(state.currentStepId).toBe("n1");
    expect(state.readStepIds).toEqual(["n1"]);
  });

  it("先頭がset_variableの場合、変数を適用しつつ次のrenderable stepまで進む", () => {
    const bundle = bundleWithScene([
      { kind: "set_variable", id: "sv1", name: "met_kaede", value: true, source: src },
      { kind: "narration", id: "n1", text: "hello", source: src },
    ]);

    const state = createInitialState(bundle);

    expect(state.currentStepId).toBe("n1");
    expect(state.variables).toEqual({ met_kaede: true });
  });

  it("先頭がjumpの場合、jump先のrenderable stepまで進む", () => {
    const bundle = bundleWithScene([
      { kind: "jump", id: "j1", targetStepId: "n2", source: src },
      { kind: "narration", id: "n1", text: "skipped", source: src },
      { kind: "narration", id: "n2", text: "landed here", source: src },
    ]);

    const state = createInitialState(bundle);

    expect(state.currentStepId).toBe("n2");
  });
});

describe("advance", () => {
  it("narration/dialogueから次のstepへ進む", () => {
    const bundle = bundleWithScene([
      { kind: "narration", id: "n1", text: "first", source: src },
      { kind: "dialogue", id: "d1", speaker: "kaede", text: "second", source: src },
    ]);
    const state = createInitialState(bundle);

    const next = advance(state, bundle);

    expect(next.currentStepId).toBe("d1");
    expect(next.readStepIds).toEqual(["n1", "d1"]);
  });

  it("choice stepに対して呼ぶとエラーになる", () => {
    const bundle = bundleWithScene([
      {
        kind: "choice",
        id: "c1",
        options: [{ id: "a", label: "A", targetStepId: "c1" }],
        source: src,
      },
    ]);
    const state = createInitialState(bundle);

    expect(() => advance(state, bundle)).toThrow();
  });

  it("ending stepに対して呼ぶとエラーになる", () => {
    const bundle = bundleWithScene([
      { kind: "ending", id: "e1", endingId: "end", source: src },
    ]);
    const state = createInitialState(bundle);

    expect(() => advance(state, bundle)).toThrow();
  });
});

describe("choose", () => {
  it("選択したchoiceIdの分岐先へ進み、choiceHistoryに記録する", () => {
    const bundle = bundleWithScene([
      {
        kind: "choice",
        id: "c1",
        options: [
          { id: "ask", label: "Ask", targetStepId: "n-ask" },
          { id: "wait", label: "Wait", targetStepId: "n-wait" },
        ],
        source: src,
      },
      { kind: "narration", id: "n-ask", text: "asked", source: src },
      { kind: "narration", id: "n-wait", text: "waited", source: src },
    ]);
    const state = createInitialState(bundle);

    const next = choose(state, bundle, "wait");

    expect(next.currentStepId).toBe("n-wait");
    expect(next.choiceHistory).toHaveLength(1);
    expect(next.choiceHistory[0]).toMatchObject({
      sceneId: "scene-1",
      stepId: "c1",
      choiceId: "wait",
    });
  });

  it("choice以外のstepに対して呼ぶとエラーになる", () => {
    const bundle = bundleWithScene([
      { kind: "narration", id: "n1", text: "hello", source: src },
    ]);
    const state = createInitialState(bundle);

    expect(() => choose(state, bundle, "anything")).toThrow();
  });

  it("存在しないchoiceIdを渡すとエラーになる", () => {
    const bundle = bundleWithScene([
      {
        kind: "choice",
        id: "c1",
        options: [{ id: "ask", label: "Ask", targetStepId: "c1" }],
        source: src,
      },
    ]);
    const state = createInitialState(bundle);

    expect(() => choose(state, bundle, "unknown")).toThrow();
  });
});

describe("getCurrentView", () => {
  it("dialogue stepの場合speaker/textを返す", () => {
    const bundle = bundleWithScene([
      { kind: "dialogue", id: "d1", speaker: "kaede", text: "hi", source: src },
    ]);
    const state = createInitialState(bundle);

    expect(getCurrentView(state, bundle)).toEqual({
      kind: "dialogue",
      speaker: "kaede",
      text: "hi",
    });
  });

  it("choice stepの場合選択肢一覧を返す", () => {
    const bundle = bundleWithScene([
      {
        kind: "choice",
        id: "c1",
        options: [{ id: "a", label: "A", targetStepId: "c1" }],
        source: src,
      },
    ]);
    const state = createInitialState(bundle);

    expect(getCurrentView(state, bundle)).toEqual({
      kind: "choice",
      options: [{ id: "a", label: "A" }],
    });
  });

  it("ending stepの場合endingIdを返す", () => {
    const bundle = bundleWithScene([
      { kind: "ending", id: "e1", endingId: "ending_quiet_distance", source: src },
    ]);
    const state = createInitialState(bundle);

    expect(getCurrentView(state, bundle)).toEqual({
      kind: "ending",
      endingId: "ending_quiet_distance",
    });
  });
});

describe("prologueフィクスチャの全経路", () => {
  it("askを選ぶとending_quiet_distanceに到達する", () => {
    let state = createInitialState(sampleStoryBundle);
    for (let i = 0; i < 6; i++) {
      state = advance(state, sampleStoryBundle);
    }
    expect(getCurrentView(state, sampleStoryBundle)).toMatchObject({ kind: "choice" });

    state = choose(state, sampleStoryBundle, "ask");
    // ask-protagonist-what -> ask-kaede-never-mind -> ask-narration-lightly
    // -> (jump) closing-narration -> closing-ending
    for (let i = 0; i < 4; i++) {
      state = advance(state, sampleStoryBundle);
    }

    expect(getCurrentView(state, sampleStoryBundle)).toEqual({
      kind: "ending",
      endingId: "ending_quiet_distance",
    });
  });

  it("waitを選ぶとending_quiet_distanceに到達する", () => {
    let state = createInitialState(sampleStoryBundle);
    for (let i = 0; i < 6; i++) {
      state = advance(state, sampleStoryBundle);
    }

    state = choose(state, sampleStoryBundle, "wait");
    // wait-narration -> wait-kaede-thanks -> (jump) closing-narration -> closing-ending
    for (let i = 0; i < 3; i++) {
      state = advance(state, sampleStoryBundle);
    }

    expect(getCurrentView(state, sampleStoryBundle)).toEqual({
      kind: "ending",
      endingId: "ending_quiet_distance",
    });
  });
});
