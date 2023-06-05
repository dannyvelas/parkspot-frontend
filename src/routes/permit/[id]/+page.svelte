<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import { monthDayYearDate, detailDate } from "$lib/time";

  export let data: PageData;
  $: result = data.result;
</script>

<svelte:head>
  <title>Print Your Permit</title>
</svelte:head>

<div id="outer">
  <div class="section">
    <h1 style="font-size:50px">Las Vistas Guest Parking Pass</h1>
    <h2 style="font-size:40px">Display on Dashboard</h2>
  </div>
  {#if !isOk(result)}
    <p>Error: {result.message}</p>
  {:else}
    <div class="section">
      <p style="font-size:70px">Permit ID: {result.data.id}</p>
      <p style="font-size:40px">Resident ID: {result.data.residentID}</p>
    </div>
    <div class="section">
      <p style="font-size:40px">Start Date: {monthDayYearDate(result.data.startDate)}</p>
      <p style="font-size:40px">End Date: {monthDayYearDate(result.data.endDate)}</p>
      <p style="font-size:40px">
        {result.data.color}
        {result.data.make}
        {result.data.model} &#58; {result.data.licensePlate}
      </p>
    </div>
    <p>Requested &#58; {detailDate(new Date(result.data.requestTS * 1000))}</p>
  {/if}
</div>

<style>
  div#outer {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .section {
    margin: 30px;
  }

  h1,
  h2,
  p {
    margin: 0px;
  }
</style>
