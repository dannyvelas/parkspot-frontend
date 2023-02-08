<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import { dateToYmd, tsToDate } from "$lib/time";

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
      <p style="font-size:40px">Start Date: {dateToYmd(result.data.startDate)}</p>
      <p style="font-size:40px">End Date: {dateToYmd(result.data.endDate)}</p>
      <p style="font-size:40px">
        {result.data.car.color}
        {result.data.car.make}
        {result.data.car.model} &#58; {result.data.car.licensePlate}
      </p>
    </div>
    <p>Requested &#58; {tsToDate(result.data.requestTS)}</p>
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
