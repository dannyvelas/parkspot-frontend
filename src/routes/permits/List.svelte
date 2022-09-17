<script lang="ts">
  import type { Permit, permitList } from "$lib/models";
  import type { User } from "$lib/models";
  import { del } from "$lib/api";
  import { isOk } from "$lib/functional";
  import { dateToYmd, tsToDate } from "$lib/convert";
  import { getLatestToken } from "$lib/auth";

  // props
  export let user: User;
  export let listName: permitList;
  export let permits: Array<Permit>;
  export let totalAmount: number;

  // events
  const deletePermit = async (i: number, permitId: number) => {
    if (confirm(`Are you sure you want to delete ${permitId}?`)) {
      const delRes = await del(`api/permit/${permitId}`, await getLatestToken());
      if (!isOk(delRes)) {
        alert(`Error deleting permit ${permitId}. Please try again later`);
        return;
      }

      permits = [...permits.slice(0, i), ...permits.slice(i + 1)];

      alert(`Deleted permit ${permitId}`);
    }
  };
</script>

<h2>Amount of Permits: {totalAmount}</h2>
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
    {#if listName === "exceptions"}
      <td>Exception Reason</td>
    {/if}
    <td>Reprint</td>
    {#if user.role === "admin"}
      <td>Edit</td>
      <td>Delete</td>
    {/if}
  </tr>
  {#each permits as permit, i (permit.id)}
    <tr>
      <td>{permit.id}</td>
      <td>{permit.residentId}</td>
      <td>{permit.car.licensePlate}</td>
      <td>{permit.car.color}</td>
      <td>{permit.car.make}</td>
      <td>{permit.car.model}</td>
      <td>{dateToYmd(permit.startDate)}</td>
      <td>{dateToYmd(permit.endDate)}</td>
      <td>{tsToDate(permit.requestTS)}</td>
      {#if listName === "exceptions"}
        <td>{permit.exceptionReason}</td>
      {/if}
      <td><a href="/permit/{permit.id}">Reprint</a></td>
      {#if user.role === "admin"}
        <td><a href="/car/{permit.car.id}">Edit</a></td>
        <td><button on:click={() => deletePermit(i, permit.id)}>Delete</button></td>
      {/if}
    </tr>
  {/each}
</table>

<style>
  table,
  td {
    border: 1px solid black;
  }

  h2 {
    text-align: center;
  }
</style>
