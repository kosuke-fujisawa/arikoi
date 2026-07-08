import type { StoryBundle } from "./story/types";

/**
 * StoryBundle JSONをfetchで取得する。DOM操作は行わないが、fetchという
 * I/O副作用を持つため、意図的にsrc/lib/story/(純粋なengine層)の外に置く。
 */
export async function loadStoryBundle(url: string): Promise<StoryBundle> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`failed to load StoryBundle: ${response.status} ${url}`);
  }
  return (await response.json()) as StoryBundle;
}
