import type { StoryBundle } from "../types";

/**
 * games/familiar-shape-of-love/scenario/en/prologue.md を手作業でJSON化した
 * フィクスチャ。runtime開発・テストの入力として使う。
 *
 * tsumugai compile --target web の実出力はkind/idではなくtype/stepIndex参照の
 * 別スキーマ(scripts/compile-story.ts の RawStoryBundle 参照)なので、
 * このフィクスチャと同じ形にはならない。実データはscripts/compile-story.tsが
 * 変換してからruntimeに渡される。
 */
export const sampleStoryBundle: StoryBundle = {
  schemaVersion: "0.1.0",
  storyBuildId: "sample-fixture-001",
  title: "A Familiar Shape of Love",
  entrySceneId: "prologue",
  assets: [
    {
      id: "bg-placeholder",
      kind: "background",
      path: "assets/bg/placeholder.png",
    },
    {
      id: "bgm-placeholder",
      kind: "bgm",
      path: "assets/music/placeholder.ogg",
    },
  ],
  scenes: [
    {
      id: "prologue",
      title: "Prologue",
      background: "bg-placeholder",
      bgm: "bgm-placeholder",
      source: {
        file: "games/familiar-shape-of-love/scenario/en/prologue.md",
        line: 1,
      },
      steps: [
        {
          kind: "narration",
          id: "opening-narration",
          text: "The walk home from school is the same one you've taken since you were kids — past the vending machines, over the river bridge, the long way around the shrine because Kaede insists it's luckier.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 9,
          },
        },
        {
          kind: "dialogue",
          id: "kaede-overslept",
          speaker: "kaede",
          text: "You overslept again this morning, didn't you.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 11,
          },
        },
        {
          kind: "dialogue",
          id: "protagonist-how-did-you-know",
          speaker: "protagonist",
          text: "How did you even know that.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 13,
          },
        },
        {
          kind: "dialogue",
          id: "kaede-your-hair",
          speaker: "kaede",
          text: "Your hair. It still hasn't decided what it's doing.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 15,
          },
        },
        {
          kind: "narration",
          id: "fixes-hair-narration",
          text: "She reaches over and fixes it without asking, the way she's done a hundred times before, like it's simply hers to fix.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 17,
          },
        },
        {
          kind: "dialogue",
          id: "kaede-keep-meaning-to-ask",
          speaker: "kaede",
          text: "I keep meaning to ask you something.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 19,
          },
        },
        {
          kind: "choice",
          id: "choice-ask-or-wait",
          options: [
            {
              id: "ask",
              label: "Ask her what it is",
              targetStepId: "ask-protagonist-what",
            },
            {
              id: "wait",
              label: "Let the silence hold",
              targetStepId: "wait-narration",
            },
          ],
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 21,
          },
        },
        {
          kind: "dialogue",
          id: "ask-protagonist-what",
          speaker: "protagonist",
          text: "What is it?",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 28,
          },
        },
        {
          kind: "dialogue",
          id: "ask-kaede-never-mind",
          speaker: "kaede",
          text: "...Never mind. Some other day, maybe.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 30,
          },
        },
        {
          kind: "narration",
          id: "ask-narration-lightly",
          text: "She says it lightly, like it costs her nothing. You've known her long enough to know when she's lying, and long enough to know better than to push.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 32,
          },
        },
        {
          kind: "jump",
          id: "ask-jump-to-closing",
          targetStepId: "closing-narration",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 34,
          },
        },
        {
          kind: "narration",
          id: "wait-narration",
          text: "You don't ask. She doesn't finish the thought. You just keep walking, in a silence that says almost everything except the one thing it's actually about.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 38,
          },
        },
        {
          kind: "dialogue",
          id: "wait-kaede-thanks",
          speaker: "kaede",
          text: "...Thanks. For not asking.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 40,
          },
        },
        {
          kind: "jump",
          id: "wait-jump-to-closing",
          targetStepId: "closing-narration",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 42,
          },
        },
        {
          kind: "narration",
          id: "closing-narration",
          text: "You reach your street the way you always do, side by side, the distance between you exactly what it's always been — and exactly not.",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 46,
          },
        },
        {
          kind: "ending",
          id: "closing-ending",
          endingId: "ending_quiet_distance",
          source: {
            file: "games/familiar-shape-of-love/scenario/en/prologue.md",
            line: 48,
          },
        },
      ],
    },
  ],
};
