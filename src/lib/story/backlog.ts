import type { EngineState } from "./engine";
import type { StoryBundle } from "./types";

export type BacklogEntry = {
  speaker?: string;
  text: string;
};

/** 表示済みのdialogue/narrationのspeaker/textをログとして蓄積する。 */
export function getBacklog(state: EngineState, bundle: StoryBundle): BacklogEntry[] {
  const scene = bundle.scenes.find((s) => s.id === state.currentSceneId);
  if (!scene) {
    throw new Error(`scene not found: ${state.currentSceneId}`);
  }

  const entries: BacklogEntry[] = [];
  for (const stepId of state.readStepIds) {
    const step = scene.steps.find((s) => s.id === stepId);
    if (!step) continue;

    if (step.kind === "dialogue") {
      entries.push({ speaker: step.speaker, text: step.text });
    } else if (step.kind === "narration") {
      entries.push({ text: step.text });
    }
  }

  return entries;
}
