<script lang="ts">
  import { MAX_AMT_PER_PAGE } from "$lib/constants";

  // props
  export let totalAmount: number;
  export let pageNum: number;
  export let pageToHref: (a: number) => string;

  // model
  const rangeSize = 5;
  $: amtPages = getAmtPages(totalAmount);
  $: pageLinks = Array.from({ length: amtPages }, (_, i) => i + 1);
  $: leftBound = pageNum;
  $: rightBound = pageNum + rangeSize > amtPages ? amtPages : pageNum + rangeSize;

  function getAmtPages(totalAmount: number) {
    const int_div = totalAmount / MAX_AMT_PER_PAGE;
    if (totalAmount % MAX_AMT_PER_PAGE !== 0) {
      return int_div + 1;
    } else {
      return int_div;
    }
  }

  function decBounds() {
    if (leftBound === 1) {
      return;
    }
    if (rightBound - leftBound >= rangeSize) {
      // if the visible range is smaller than `rangeSize` because we're near the end,
      // then, if we scroll to the left, by not decrementing the right bound, we can make the
      // visible range size get closer or equal to `rangeSize`
      rightBound = rightBound - 1;
    }
    leftBound = leftBound - 1;
  }

  function incBounds() {
    if (rightBound === amtPages) {
      return;
    }
    leftBound = leftBound + 1;
    rightBound = rightBound + 1;
  }
</script>

{#if pageLinks.length > 1}
  <button on:click={() => console.log(leftBound)}>Hi</button>
  <nav class="flex flex-row justify-center align-center gap-2">
    <button on:click={decBounds}>
      <iconify-icon
        class="text-green-400"
        icon="material-symbols:arrow-circle-left-outline-rounded"
      />
    </button>
    <ul class="list-none flex flex-row gap-2">
      {#each pageLinks as pageLink}
        {#if pageLink >= leftBound && pageLink <= rightBound}
          <li class:text-green-400={pageNum === pageLink}>
            <a href={pageToHref(pageLink)}>{pageLink}</a>
          </li>
        {/if}
      {/each}
    </ul>
    <button on:click={incBounds}>
      <iconify-icon
        class="text-green-400"
        icon="material-symbols:arrow-circle-right-outline-rounded"
      />
    </button>
  </nav>
{/if}
