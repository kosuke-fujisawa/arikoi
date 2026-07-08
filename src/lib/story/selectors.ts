import type { EngineState } from "./engine";
import type { StoryBundle } from "./types";

export type DebugInfo = {
  sceneId: string;
  stepId: string;
  sourceFile: string;
  sourceLine: number;
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
    sceneId: state.currentSceneId,
    stepId: state.currentStepId,
    sourceFile: step.source.file,
    sourceLine: step.source.line,
    variables: state.variables,
    choiceHistory: state.choiceHistory,
  };
}
