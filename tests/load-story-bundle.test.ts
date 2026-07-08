import { afterEach, describe, expect, it, vi } from "vitest";
import { loadStoryBundle } from "../src/lib/loadStoryBundle";
import { sampleStoryBundle } from "../src/lib/story/__fixtures__/sample-story-bundle";

describe("loadStoryBundle", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("指定したURLからJSONをfetchしてStoryBundleとして返す", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => sampleStoryBundle,
    }));
    vi.stubGlobal("fetch", fetchMock);

    const bundle = await loadStoryBundle("/story/story-bundle.json");

    expect(fetchMock).toHaveBeenCalledWith("/story/story-bundle.json");
    expect(bundle).toEqual(sampleStoryBundle);
  });

  it("レスポンスがokでない場合はエラーを投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })),
    );

    await expect(loadStoryBundle("/story/missing.json")).rejects.toThrow(/404/);
  });
});
