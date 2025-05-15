<script lang="ts">
  import { MAX_AMT_PER_PAGE } from "$lib/constants";

  
  interface Props {
    // props
    totalAmount: number;
    pageNum: number;
    pageToHref: (a: number) => string;
  }

  let { totalAmount, pageNum, pageToHref }: Props = $props();

  // model
  const rangeSize = 5;

  function getAmtPages(totalAmount: number) {
    const int_div = totalAmount / MAX_AMT_PER_PAGE;
    if (totalAmount % MAX_AMT_PER_PAGE !== 0) {
      return int_div + 1;
    } else {
      return int_div;
    }
  }

  function decBounds() {
    const decAmount = leftBound <= rangeSize ? leftBound - 1 : rangeSize;
    leftBound = leftBound - decAmount;
    rightBound = leftBound + rangeSize > amtPages ? amtPages : leftBound + rangeSize;
  }

  function incBounds() {
    const amtPagesRemaining = amtPages - rightBound;
    const incAmount = amtPagesRemaining < rangeSize ? amtPagesRemaining : rangeSize;
    rightBound = rightBound + incAmount;
    leftBound = rightBound - rangeSize <= 0 ? 1 : rightBound - rangeSize;
  }
  let amtPages = $derived(getAmtPages(totalAmount));
  let pageLinks = $derived(Array.from({ length: amtPages }, (_, i) => i + 1));
  let leftBound = $derived(pageNum);
  let rightBound = $derived(pageNum + rangeSize > amtPages ? amtPages : pageNum + rangeSize);
</script>

{#if pageLinks.length > 1}
  <nav class="flex flex-row justify-center align-center gap-2 mt-6">
    {#if leftBound > 1}
      <button onclick={decBounds}>
        <iconify-icon
          class="text-green-400"
          icon="material-symbols:arrow-circle-left-outline-rounded"
></iconify-icon>
      </button>
    {/if}
    <ul class="list-none flex flex-row gap-2">
      {#each pageLinks as pageLink}
        {#if pageLink >= leftBound && pageLink <= rightBound}
          <li class:text-green-400={pageNum === pageLink}>
            <a href={pageToHref(pageLink)}>{pageLink}</a>
          </li>
        {/if}
      {/each}
    </ul>
    {#if rightBound < amtPages}
      <button onclick={incBounds}>
        <iconify-icon
          class="text-green-400"
          icon="material-symbols:arrow-circle-right-outline-rounded"
></iconify-icon>
      </button>
    {/if}
  </nav>
{/if}
