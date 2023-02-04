<script lang="ts">
  import { MAX_AMT_PER_PAGE } from "$lib/constants";

  // props
  export let totalAmount: number;
  export let pageToHref: (a: number) => string;
  export let currPageNum: number;

  $: pageNums = Array.from({ length: getAmtPages(totalAmount) }, (_, i) => i + 1);

  function getAmtPages(totalAmount: number) {
    const int_div = totalAmount / MAX_AMT_PER_PAGE;
    if (totalAmount % MAX_AMT_PER_PAGE !== 0) {
      return int_div + 1;
    } else {
      return int_div;
    }
  }
</script>

{#if pageNums.length > 1}
  <h3>Pages:</h3>
  <nav>
    <ul class="pagination">
      {#each pageNums as pageNum}
        <li class="page-item" class:active={currPageNum == pageNum}>
          <a href={pageToHref(pageNum)}>{pageNum}</a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .pagination {
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-item {
    margin: 5px;
  }

  h3 {
    text-align: center;
  }
</style>
