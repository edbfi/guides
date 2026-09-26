<script lang="ts">
// Svelte 5 island (runes): a "follow along" checklist for multi-step guides.
// Teachers can tick off each step as they go, with a small progress indicator.
// State is rune-based (a $state array, mutated in place) and the list uses a
// keyed {#each} block per the project rules.

type Props = {
  /** Step labels, in order. */
  steps?: string[];
  /** Heading shown above the list. */
  title?: string;
};

let { steps = [], title = "Følg med – sæt flueben efterhånden" }: Props = $props();

let checked = $state<boolean[]>(steps.map(() => false));

const doneCount = $derived(checked.filter(Boolean).length);
const total = $derived(steps.length);
const allDone = $derived(total > 0 && doneCount === total);

function toggle(index: number): void {
  checked[index] = !checked[index];
}

function reset(): void {
  checked = steps.map(() => false);
}
</script>

{#if total > 0}
  <div class="sc">
    <div class="sc__head">
      <span class="sc__title">{title}</span>
      <span class="sc__count"> {doneCount} / {total} </span>
    </div>

    <div
      class="sc__bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={doneCount}
    >
      <span class="sc__bar-fill" style="width: {total ? (doneCount / total) * 100 : 0}%"></span>
    </div>

    <ul class="sc__list">
      {#each steps as step, index (index)}
        <li class="sc__item">
          <label class="sc__label" class:sc__label--done={checked[index]}>
            <input
              type="checkbox"
              class="sc__check"
              checked={checked[index]}
              onchange={() => toggle(index)}
            >
            <span>{step}</span>
          </label>
        </li>
      {/each}
    </ul>

    <div class="sc__foot">
      {#if allDone}
        <span class="sc__done-msg">Sådan! Du er igennem alle trin 🎉</span>
      {:else}
        <button type="button" class="sc__reset" onclick={reset}>Nulstil</button>
      {/if}
    </div>
  </div>
{/if}
