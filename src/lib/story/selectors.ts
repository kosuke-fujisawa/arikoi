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

/**
 * デバッグ表示等が使う派生情報の取得。
 * 実装は#30で行う。
 */
export function getDebugInfo(
  _state: EngineState,
  _bundle: StoryBundle,
): DebugInfo {
  throw new Error("not implemented: see issue #30");
}
