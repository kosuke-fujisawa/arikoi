<script lang="ts">
  import {
    advance,
    choose,
    getCurrentView,
    type EngineState,
  } from "../lib/story/engine";
  import type { StoryBundle } from "../lib/story/types";
  import SaveLoadPanel from "./SaveLoadPanel.svelte";
  import DebugPanel from "./DebugPanel.svelte";
  import BacklogPanel from "./BacklogPanel.svelte";

  let { bundle, initialState }: { bundle: StoryBundle; initialState: EngineState } =
    $props();

  // initialStateは初回マウント時のスナップショットとして使う。App.svelteは
  // Start/Continueのたびに新しいNovelScreenインスタンスを作るため、以降の
  // propsの変化を追跡する必要はない。
  let engineState: EngineState = $state(initialState);
  let view = $derived(getCurrentView(engineState, bundle));

  function handleAdvance() {
    const view = getCurrentView(engineState, bundle);
    if (view.kind === "dialogue" || view.kind === "narration") {
      engineState = advance(engineState, bundle);
    }
  }

  function handleChoice(choiceId: string) {
    engineState = choose(engineState, bundle, choiceId);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAdvance();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<DebugPanel {engineState} {bundle} />

<section
  class="novel-screen"
  role="button"
  tabindex="0"
  onclick={handleAdvance}
  onkeydown={handleKeydown}
>
  <SaveLoadPanel
    {engineState}
    {bundle}
    onLoad={(restored) => {
      engineState = restored;
    }}
  />
  <BacklogPanel {engineState} {bundle} />
  {#if view.kind === "dialogue"}
    <p class="speaker">{view.speaker}</p>
    <p class="text">{view.text}</p>
  {:else if view.kind === "narration"}
    <p class="text">{view.text}</p>
  {:else if view.kind === "choice"}
    <ul class="choices">
      {#each view.options as option (option.id)}
        <li>
          <button
            onclick={(e) => {
              e.stopPropagation();
              handleChoice(option.id);
            }}
          >
            {option.label}
          </button>
        </li>
      {/each}
    </ul>
  {:else if view.kind === "ending"}
    <p class="ending">-- {view.endingId} --</p>
    <button
      onclick={(e) => {
        e.stopPropagation();
        location.reload();
      }}
    >
      Play again
    </button>
  {/if}
</section>

<style>
  .novel-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem;
    cursor: pointer;
  }

  .speaker {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .choices {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ending {
    font-style: italic;
  }
</style>
