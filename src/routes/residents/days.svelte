<script context="module" lang="ts">
  import { MAX_AMT_PER_PAGE } from "$lib/constants";
  import { getLoadFn } from "./_load";

  const limit = MAX_AMT_PER_PAGE;

  export const load = getLoadFn("api/residents", limit, false);
</script>

<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { ListWithMetadata, Resident } from "$lib/models";
  import { isOk } from "$lib/functional";
  import Pagination from "$lib/Pagination.svelte";

  export let result: Result<ListWithMetadata<Resident>>;
  export let currPageNum: number;
</script>

<svelte:head>
  <title>Residents and Guest Parking Days</title>
</svelte:head>

<h1>Residents and Guest Parking Days</h1>

{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    <h2>Amount of Residents Giving Parking Passes: {result.data.metadata.totalAmount}</h2>
    <div>
      <table>
        <tr>
          <td>Resident ID</td>
          <td>Total Stay</td>
        </tr>
        {#each result.data.records as resident}
          <tr>
            <td>{resident.id}</td>
            <td>{resident.amtParkingDaysUsed}</td>
          </tr>
        {/each}
      </table>
    </div>
    <Pagination
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(page) => `residents/days?page=${page}`}
      {currPageNum}
      {limit}
    />
  </div>
{/if}

<style>
  table,
  td {
    border: 1px solid black;
  }

  .stack-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    text-align: center;
  }
</style>
