<script lang="ts">
  import { getBacklog } from "../lib/story/backlog";
  import type { EngineState } from "../lib/story/engine";
  import type { StoryBundle } from "../lib/story/types";

  let { engineState, bundle }: { engineState: EngineState; bundle: StoryBundle } =
    $props();

  let visible = $state(false);
  let entries = $derived(getBacklog(engineState, bundle));

  function toggle(e: MouseEvent) {
    e.stopPropagation();
    visible = !visible;
  }
</script>

<button class="backlog-toggle" onclick={toggle}>Backlog</button>

{#if visible}
  <div
    class="backlog-panel"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    role="presentation"
  >
    <button class="close" onclick={toggle}>Close</button>
    <ul>
      {#each entries as entry, i (i)}
        <li>
          {#if entry.speaker}<span class="speaker">{entry.speaker}: </span>{/if}
          <span class="text">{entry.text}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .backlog-toggle {
    position: relative;
    z-index: 901;
  }

  .backlog-panel {
    position: fixed;
    inset: 0;
    overflow-y: auto;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    z-index: 900;
  }

  .backlog-panel ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .speaker {
    font-weight: bold;
  }
</style>
