<script context="module" lang="ts">
  import type { Load } from "./[id]";
  import { get } from "$lib/api";
  import { permitDecoder } from "$lib/models";

  export const load: Load = async ({ session, params }) => {
    if (!session.user) {
      return { status: 302, redirect: "/" };
    }

    const result = await get(`api/permit/${params.id}`, {}, permitDecoder);

    return {
      props: {
        result,
      },
    };
  };
</script>

<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { dateToYmd } from "$lib/convert";

  export let result: Result<Permit>;

  const tsToDate = (ts: number): string => {
    if (ts === 0) {
      return "";
    }
    const date = new Date(ts * 1000);
    const offset = date.getTimezoneOffset();
    const offset_date = new Date(date.getTime() - offset * 60 * 1000).toISOString();
    return offset_date.replace("T", " ").split(".")[0];
  };
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
      <p style="font-size:40px">Resident ID: {result.data.residentId}</p>
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
