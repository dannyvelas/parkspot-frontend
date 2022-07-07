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
  <title>All Residents</title>
</svelte:head>

<h1>All Residents</h1>

{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    <h2>Amount of Residents: {result.data.metadata.totalAmount}</h2>
    <div>
      <table>
        <tr>
          <td>Resident ID</td>
          <td>First Name</td>
          <td>Last Name</td>
          <td>Phone</td>
          <td>Email</td>
          <td>Unlimited Days</td>
          <td>Edit</td>
          <td>Delete</td>
        </tr>
        {#each result.data.records as resident}
          <tr>
            <td>{resident.id}</td>
            <td>{resident.firstName}</td>
            <td>{resident.lastName}</td>
            <td>{resident.phone}</td>
            <td>{resident.email}</td>
            <td>{resident.unlimDays}</td>
            <td><a href="resident/{resident.id}">Edit</a></td>
            <td><button>Delete</button></td>
          </tr>
        {/each}
      </table>
    </div>
    <Pagination
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(page) => `residents?page=${page}`}
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
