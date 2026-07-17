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

  // 開発者向けの詳細(なぜ壊れているか)はconsoleにのみ出し、画面には
  // ユーザー向けの固定文言だけを表示する(不一致の原因はゲームデータの
  // 破損・バージョン不整合であり、ユーザーが対処できる情報ではないため)。
  const UNSUPPORTED_STORY_MESSAGE =
    "This game data isn't supported. Please refresh the page or try again later.";

  let bundle: StoryBundle | null = $state(null);
  let screen: Screen = $state({ kind: "loading" });
  let hasSave: boolean = $state(false);
  let continueError: string | null = $state(null);

  $effect(() => {
    loadStoryBundle(`${import.meta.env.BASE_URL}story/story-bundle.json`)
      .then((loaded) => {
        const validationError = validateStoryBundle(loaded);
        if (validationError) {
          console.error("StoryBundle validation failed:", validationError);
          screen = { kind: "error", message: UNSUPPORTED_STORY_MESSAGE };
          return;
        }
        bundle = loaded;
        hasSave = readRawSaveData() !== null;
        screen = { kind: "title" };
      })
      .catch((e: unknown) => {
        console.error("Failed to load StoryBundle:", e);
        screen = { kind: "error", message: UNSUPPORTED_STORY_MESSAGE };
      });
  });

  function handleStart() {
    if (!bundle) return;
    continueError = null;
    screen = { kind: "playing", initialState: createInitialState(bundle) };
  }

  function handleContinue() {
    if (!bundle) return;
    const raw = readRawSaveData();
    if (!raw) return;

    const result = restoreSaveData(raw, bundle);
    if ("code" in result) {
      console.error("Failed to restore SaveData:", result);
      continueError = "Your save data couldn't be loaded. Please start a new game.";
      return;
    }
    continueError = null;
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
    {continueError}
    onStart={handleStart}
    onContinue={handleContinue}
  />
{:else if screen.kind === "playing" && bundle}
  <NovelScreen {bundle} initialState={screen.initialState} />
{/if}
