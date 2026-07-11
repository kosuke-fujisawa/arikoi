<script lang="ts">
  let {
    title,
    hasSave,
    continueError = null,
    onStart,
    onContinue,
  }: {
    title: string;
    hasSave: boolean;
    continueError?: string | null;
    onStart: () => void;
    onContinue: () => void;
  } = $props();
</script>

<section class="title-screen">
  <h1>{title}</h1>
  <div class="menu">
    <button onclick={onStart}>Start</button>
    {#if hasSave}
      <button onclick={onContinue}>Continue</button>
    {/if}
    {#if continueError}
      <p class="continue-error">{continueError}</p>
    {/if}
  </div>
</section>

<style>
  .title-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .continue-error {
    color: #f66;
    font-size: 0.9rem;
  }
</style>
