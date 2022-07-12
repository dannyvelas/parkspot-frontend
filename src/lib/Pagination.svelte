<script lang="ts">
  export let totalAmount: number;
  export let pageToHref: (a: number) => string;
  export let currPageNum: number;
  export let limit: number;

  const amountPages = (() => {
    const int_div = totalAmount / limit;
    if (totalAmount % limit !== 0) {
      return int_div + 1;
    } else {
      return int_div;
    }
  })();
  const pageNums = Array.from({ length: amountPages }, (_, i) => i + 1);
</script>

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
