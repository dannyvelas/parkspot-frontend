<script lang="ts">
  import type { Permit } from "$lib/models";
  import { del } from "$lib/api";
  import { isOk } from "$lib/functional";
  import Pagination from "$lib/Pagination.svelte";

  // props
  export let listType: "all" | "expired" | "active" | "exceptions";
  export let permits: Array<Permit>;
  export let totalAmount: number;
  export let pageToHref: (a: number) => string; // pagination
  export let currPageNum: number; // pagination
  export let limit: number; // pagination

  // rendering
  const renderDate = (date: Date): string => {
    const dateStr = date.toISOString();
    return dateStr.split("T")[0];
  };
  const tsToDate = (ts: number): string => {
    if (ts === 0) {
      return "";
    }
    const date = new Date(ts * 1000);
    const offset = date.getTimezoneOffset();
    const offset_date = new Date(date.getTime() - offset * 60 * 1000).toISOString();
    return offset_date.replace("T", " ").split(".")[0];
  };

  // events
  const deletePermit = async (i: number, permitId: number) => {
    if (confirm(`Are you sure you want to delete ${permitId}?`)) {
      const delRes = await del(`api/permit/${permitId}`);
      if (!isOk(delRes)) {
        alert(`Error deleting permit ${permitId}. Please try again later`);
        return;
      }

      permits = [...permits.slice(0, i), ...permits.slice(i + 1)];

      alert(`Deleted permit ${permitId}`);
    }
  };
</script>

<div>
  <h2>Amount of Permits: {totalAmount}</h2>
  <div>
    <table>
      <tr>
        <td>Permit ID</td>
        <td>Resident ID</td>
        <td>License Plate</td>
        <td>Color</td>
        <td>Make</td>
        <td>Model</td>
        <td>Start Date</td>
        <td>End Date</td>
        <td>Request Date</td>
        {#if listType === "exceptions"}
          <td>Exception Reason</td>
        {/if}
        <td>Reprint</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
      {#each permits as permit, i (permit.id)}
        <tr>
          <td>{permit.id}</td>
          <td>{permit.residentId}</td>
          <td>{permit.car.licensePlate}</td>
          <td>{permit.car.color}</td>
          <td>{permit.car.make}</td>
          <td>{permit.car.model}</td>
          <td>{renderDate(permit.startDate)}</td>
          <td>{renderDate(permit.endDate)}</td>
          <td>{tsToDate(permit.requestTS)}</td>
          {#if listType === "exceptions"}
            <td>{permit.exceptionReason}</td>
          {/if}
          <td><a href="/permit/{permit.id}">Reprint</a></td>
          <td><a href="car/{permit.car.id}">Edit</a></td>
          <td><button on:click={() => deletePermit(i, permit.id)}>Delete</button></td>
        </tr>
      {/each}
    </table>
  </div>
  <Pagination {totalAmount} {pageToHref} {currPageNum} {limit} />
</div>

<style>
  table,
  td {
    border: 1px solid black;
  }

  h2 {
    text-align: center;
  }
</style>
