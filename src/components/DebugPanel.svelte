<script lang="ts">
  import { getDebugInfo } from "../lib/story/selectors";
  import type { EngineState } from "../lib/story/engine";
  import type { StoryBundle } from "../lib/story/types";

  let { engineState, bundle }: { engineState: EngineState; bundle: StoryBundle } =
    $props();

  let visible = $state(false);
  let info = $derived(getDebugInfo(engineState, bundle));

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "F2") {
      e.preventDefault();
      visible = !visible;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
  <pre
    class="debug-panel"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    role="presentation"
  >buildId: {info.storyBuildId}
sceneId: {info.sceneId}
stepId: {info.stepId}
stepKind: {info.stepKind}
source: {info.sourceFile}:{info.sourceLine}{info.sourceColumn ? `:${info.sourceColumn}` : ""}
readStepCount: {info.readStepCount}
variables: {JSON.stringify(info.variables)}
choiceHistory: {JSON.stringify(info.choiceHistory)}</pre>
{/if}

<style>
  .debug-panel {
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0.5rem;
    max-width: 100vw;
    font-size: 0.75rem;
    background: rgba(0, 0, 0, 0.75);
    color: #0f0;
    white-space: pre-wrap;
    z-index: 1000;
  }
</style>
