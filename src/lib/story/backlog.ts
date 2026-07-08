import type { EngineState } from "./engine";
import type { StoryBundle } from "./types";

export type BacklogEntry = {
  speaker?: string;
  text: string;
};

/**
 * 表示済みのdialogue/narrationのspeaker/textをログとして蓄積する。
 * 実装は#32で行う。
 */
export function getBacklog(
  _state: EngineState,
  _bundle: StoryBundle,
): BacklogEntry[] {
  throw new Error("not implemented: see issue #32");
}
