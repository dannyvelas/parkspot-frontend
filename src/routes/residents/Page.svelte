<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { ListWithMetadata, Resident } from "$lib/models";
  import { afterNavigate } from "$app/navigation";
  import { residentDecoder, previewResident } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { del } from "$lib/api";
  import { page } from "$app/stores";
  import { getLatestToken } from "$lib/auth";
  import Pagination from "$lib/components/Pagination.svelte";
  import Search from "$lib/components/Search.svelte";

  // props
  export let title: string;
  export let fullInfo: boolean;
  export let result: Result<ListWithMetadata<Resident>>;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let initialResidents: Array<Resident>; // holds permits before any searching happened
  let bannerError = "";
  afterNavigate(() => {
    initialResidents = (result.data && result.data.records) || [];
  });

  // events
  const deleteResident = async (i: number, residentId: string) => {
    if (confirm(`Are you sure you want to delete ${residentId}?`)) {
      const delRes = await del(`api/resident/${residentId}`, await getLatestToken());
      if (!isOk(delRes)) {
        alert(`Error deleting resident ${residentId}. Please try again later`);
        return;
      }

      result.data!.records = [
        ...result.data!.records.slice(0, i),
        ...result.data!.records.slice(i + 1),
      ];
      result.data!.metadata.totalAmount = result.data!.metadata.totalAmount - 1;

      alert(`Deleted resident ${residentId}`);
    }
  };
  const handleSearch = async (event: CustomEvent<Result<Resident[]>>) => {
    if (!isOk(event.detail)) {
      result.data!.records = initialResidents;
      bannerError = `Error searching: ${event.detail.message}`;
      return;
    }

    result.data!.records = event.detail.data;
    bannerError = "";
  };
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    {#if bannerError != ""}
      <div>
        <p>{bannerError}. Please try again later.</p>
      </div>
    {/if}
    <Search
      initialList={initialResidents}
      decoder={residentDecoder}
      preview={previewResident}
      totalAmount={result.data.metadata.totalAmount}
      endpoint={`api/residents`}
      on:result={handleSearch}
    />
    <h2>Amount of Residents: {result.data.metadata.totalAmount}</h2>
    <div>
      <table>
        <tr>
          {#if fullInfo}
            <td>Resident ID</td>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Phone</td>
            <td>Email</td>
            <td>Unlimited Days</td>
            <td>Amount Of Days Used</td>
            <td>Edit</td>
            <td>Delete</td>
          {:else}
            <td>Resident ID</td>
            <td>Total Stay</td>
          {/if}
        </tr>
        {#each result.data.records as resident, i (resident.id)}
          <tr>
            {#if fullInfo}
              <td>{resident.id}</td>
              <td>{resident.firstName}</td>
              <td>{resident.lastName}</td>
              <td>{resident.phone}</td>
              <td>{resident.email}</td>
              <td>{resident.unlimDays}</td>
              <td>{resident.amtParkingDaysUsed}</td>
              <td><a href="resident/{resident.id}">Edit</a></td>
              <td><button on:click={() => deleteResident(i, resident.id)}>Delete</button></td>
            {:else}
              <td>{resident.id}</td>
              <td>{resident.amtParkingDaysUsed}</td>
            {/if}
          </tr>
        {/each}
      </table>
    </div>
    <Pagination
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(page) => `/residents?page=${page}`}
      {currPageNum}
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
