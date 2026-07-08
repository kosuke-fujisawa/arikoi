<script lang="ts">
  let {
    title,
    hasSave,
    onStart,
    onContinue,
  }: {
    title: string;
    hasSave: boolean;
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
</style>
