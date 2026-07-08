import type { SaveData } from "../types";

/** ask を選び、closingを経てending_quiet_distanceに到達する手前のフィクスチャ。 */
export const sampleSaveData: SaveData = {
  appVersion: "0.0.0",
  storySchemaVersion: "0.1.0",
  storyBuildId: "sample-fixture-001",
  slotId: "default",
  savedAt: "2026-07-08T12:00:00.000Z",
  currentSceneId: "prologue",
  currentStepId: "ask-narration-lightly",
  variables: {},
  choiceHistory: [
    {
      sceneId: "prologue",
      stepId: "choice-ask-or-wait",
      choiceId: "ask",
      selectedAt: "2026-07-08T11:59:00.000Z",
    },
  ],
  readStepIds: [
    "opening-narration",
    "kaede-overslept",
    "protagonist-how-did-you-know",
    "kaede-your-hair",
    "fixes-hair-narration",
    "kaede-keep-meaning-to-ask",
    "choice-ask-or-wait",
    "ask-protagonist-what",
    "ask-kaede-never-mind",
    "ask-narration-lightly",
  ],
};
