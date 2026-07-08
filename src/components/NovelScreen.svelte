<script lang="ts">
  import {
    advance,
    choose,
    createInitialState,
    getCurrentView,
    validateStoryBundle,
    type EngineState,
  } from "../lib/story/engine";
  import type { StoryBundle } from "../lib/story/types";
  import { loadStoryBundle } from "../lib/loadStoryBundle";

  let bundle: StoryBundle | null = $state(null);
  let engineState: EngineState | null = $state(null);
  let error: string | null = $state(null);

  $effect(() => {
    loadStoryBundle("/story/story-bundle.json")
      .then((loaded) => {
        const validationError = validateStoryBundle(loaded);
        if (validationError) {
          error = validationError.message;
          return;
        }
        bundle = loaded;
        engineState = createInitialState(loaded);
      })
      .catch((e: unknown) => {
        error = e instanceof Error ? e.message : String(e);
      });
  });

  function handleAdvance() {
    if (!bundle || !engineState) return;
    const view = getCurrentView(engineState, bundle);
    if (view.kind === "dialogue" || view.kind === "narration") {
      engineState = advance(engineState, bundle);
    }
  }

  function handleChoice(choiceId: string) {
    if (!bundle || !engineState) return;
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

{#if error}
  <p class="error">{error}</p>
{:else if bundle && engineState}
  {@const view = getCurrentView(engineState, bundle)}
  <section
    class="novel-screen"
    role="button"
    tabindex="0"
    onclick={handleAdvance}
    onkeydown={handleKeydown}
  >
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
    {/if}
  </section>
{:else}
  <p>Loading…</p>
{/if}

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
