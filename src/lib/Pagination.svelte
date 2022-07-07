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

<nav>
  <ul class="pagination">
    {#each pageNums as pageNum}
      <li class="page-item" class:active={currPageNum == pageNum}>
        <a class="page-link" href={pageToHref(pageNum)}>{pageNum}</a>
      </li>
    {/each}
  </ul>
</nav>
