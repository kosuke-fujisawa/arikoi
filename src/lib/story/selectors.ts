import type { EngineState } from "./engine";
import type { StoryBundle } from "./types";

export type DebugInfo = {
  storyBuildId: string;
  sceneId: string;
  stepId: string;
  stepKind: StoryBundle["scenes"][number]["steps"][number]["kind"];
  sourceFile: string;
  sourceLine: number;
  sourceColumn?: number;
  readStepCount: number;
  variables: Record<string, unknown>;
  choiceHistory: EngineState["choiceHistory"];
};

/** デバッグ表示等が使う派生情報の取得。 */
export function getDebugInfo(state: EngineState, bundle: StoryBundle): DebugInfo {
  const scene = bundle.scenes.find((s) => s.id === state.currentSceneId);
  if (!scene) {
    throw new Error(`scene not found: ${state.currentSceneId}`);
  }
  const step = scene.steps.find((s) => s.id === state.currentStepId);
  if (!step) {
    throw new Error(`step not found: ${state.currentStepId}`);
  }

  return {
    storyBuildId: bundle.storyBuildId,
    sceneId: state.currentSceneId,
    stepId: state.currentStepId,
    stepKind: step.kind,
    sourceFile: step.source.file,
    sourceLine: step.source.line,
    sourceColumn: step.source.column,
    readStepCount: state.readStepIds.length,
    variables: state.variables,
    choiceHistory: state.choiceHistory,
  };
}
