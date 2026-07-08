<script lang="ts">
  import { loadStoryBundle } from "./lib/loadStoryBundle";
  import {
    validateStoryBundle,
    createInitialState,
    type EngineState,
  } from "./lib/story/engine";
  import { restoreSaveData } from "./lib/story/save";
  import { readRawSaveData } from "./lib/saveStorage";
  import type { StoryBundle } from "./lib/story/types";
  import TitleScreen from "./components/TitleScreen.svelte";
  import NovelScreen from "./components/NovelScreen.svelte";

  type Screen =
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "title" }
    | { kind: "playing"; initialState: EngineState };

  let bundle: StoryBundle | null = $state(null);
  let screen: Screen = $state({ kind: "loading" });
  let hasSave: boolean = $state(false);

  $effect(() => {
    loadStoryBundle("/story/story-bundle.json")
      .then((loaded) => {
        const validationError = validateStoryBundle(loaded);
        if (validationError) {
          screen = { kind: "error", message: validationError.message };
          return;
        }
        bundle = loaded;
        hasSave = readRawSaveData() !== null;
        screen = { kind: "title" };
      })
      .catch((e: unknown) => {
        screen = { kind: "error", message: e instanceof Error ? e.message : String(e) };
      });
  });

  function handleStart() {
    if (!bundle) return;
    screen = { kind: "playing", initialState: createInitialState(bundle) };
  }

  function handleContinue() {
    if (!bundle) return;
    const raw = readRawSaveData();
    if (!raw) return;

    const result = restoreSaveData(raw, bundle);
    if ("code" in result) {
      screen = { kind: "playing", initialState: createInitialState(bundle) };
      return;
    }
    screen = { kind: "playing", initialState: result };
  }
</script>

{#if screen.kind === "loading"}
  <p>Loading…</p>
{:else if screen.kind === "error"}
  <p class="error">{screen.message}</p>
{:else if screen.kind === "title" && bundle}
  <TitleScreen
    title={bundle.title}
    {hasSave}
    onStart={handleStart}
    onContinue={handleContinue}
  />
{:else if screen.kind === "playing" && bundle}
  <NovelScreen {bundle} initialState={screen.initialState} />
{/if}
