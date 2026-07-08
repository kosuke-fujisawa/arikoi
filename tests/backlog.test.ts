import { describe, expect, it } from "vitest";
import { getBacklog } from "../src/lib/story/backlog";
import { advance, createInitialState } from "../src/lib/story/engine";
import { sampleStoryBundle } from "../src/lib/story/__fixtures__/sample-story-bundle";

describe("getBacklog", () => {
  it("初期状態では最初のnarrationのみを含む", () => {
    const state = createInitialState(sampleStoryBundle);

    const backlog = getBacklog(state, sampleStoryBundle);

    expect(backlog).toEqual([
      {
        text: "The walk home from school is the same one you've taken since you were kids — past the vending machines, over the river bridge, the long way around the shrine because Kaede insists it's luckier.",
      },
    ]);
  });

  it("数行進めると、既読のdialogue/narrationがspeaker/text付きで蓄積される", () => {
    let state = createInitialState(sampleStoryBundle);
    for (let i = 0; i < 2; i++) {
      state = advance(state, sampleStoryBundle);
    }

    const backlog = getBacklog(state, sampleStoryBundle);

    expect(backlog).toEqual([
      { text: expect.stringContaining("walk home") },
      { speaker: "kaede", text: "You overslept again this morning, didn't you." },
      { speaker: "protagonist", text: "How did you even know that." },
    ]);
  });

  it("選択肢stepまで進んだ場合、選択肢自体はバックログに含めない", () => {
    let state = createInitialState(sampleStoryBundle);
    for (let i = 0; i < 6; i++) {
      state = advance(state, sampleStoryBundle);
    }

    const backlog = getBacklog(state, sampleStoryBundle);

    expect(backlog).toHaveLength(6);
    expect(backlog.every((entry) => "text" in entry)).toBe(true);
  });
});
