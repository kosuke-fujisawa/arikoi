<script lang="ts">
  import { createSaveData, restoreSaveData } from "../lib/story/save";
  import {
    clearRawSaveData,
    readRawSaveData,
    writeRawSaveData,
  } from "../lib/saveStorage";
  import type { EngineState } from "../lib/story/engine";
  import type { StoryBundle } from "../lib/story/types";

  let {
    engineState,
    bundle,
    onLoad,
  }: {
    engineState: EngineState;
    bundle: StoryBundle;
    onLoad: (state: EngineState) => void;
  } = $props();

  let message: string | null = $state(null);

  function handleSave(e: MouseEvent) {
    e.stopPropagation();
    const saveData = createSaveData(engineState, bundle);
    writeRawSaveData(saveData);
    message = "Saved.";
  }

  function handleLoad(e: MouseEvent) {
    e.stopPropagation();
    const raw = readRawSaveData();
    if (!raw) {
      message = "No save data.";
      return;
    }

    const result = restoreSaveData(raw, bundle);
    if ("code" in result) {
      message = `Load failed: ${result.message}`;
      clearRawSaveData();
      return;
    }

    onLoad(result);
    message = "Loaded.";
  }
</script>

<div class="save-load-panel">
  <button onclick={handleSave}>Save</button>
  <button onclick={handleLoad}>Load</button>
  {#if message}
    <p class="message">{message}</p>
  {/if}
</div>

<style>
  .save-load-panel {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .message {
    margin: 0;
    font-size: 0.85rem;
  }
</style>
