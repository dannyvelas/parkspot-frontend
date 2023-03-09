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
</script>

{#if pageLinks.length > 1}
  <button on:click={() => console.log(leftBound)}>Hi</button>
  <nav>
    <ul class="list-none flex flex-row justify-center">
      {#each pageLinks as pageLink}
        {#if pageLink >= leftBound && pageLink <= rightBound}
          <li class="m-2" class:active={pageNum == pageLink}>
            <a href={pageToHref(pageLink)}>{pageLink}</a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
{/if}
