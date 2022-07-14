<script lang="ts">
  import type { Visitor } from "$lib/models";
  import { del } from "$lib/api";
  import { isOk } from "$lib/functional";

  // props
  export let visitors: Array<Visitor>;
  export let totalAmount: number;

  // rendering
  const renderDate = (date: Date): string => {
    const dateStr = date.toISOString();
    return dateStr.split("T")[0];
  };

  // events
  const deleteVisitor = async (i: number, visitorId: string, fullName: string) => {
    if (confirm(`Are you sure you want to delete ${fullName}?`)) {
      const delRes = await del(`api/visitor/${visitorId}`);
      if (!isOk(delRes)) {
        alert(`Error deleting visitor ${fullName}. Please try again later`);
        return;
      }

      visitors = [...visitors.slice(0, i), ...visitors.slice(i + 1)];

      alert(`Deleted visitor ${fullName}`);
    }
  };
</script>

<svelte:head>
  <title>All Visitors</title>
</svelte:head>

<div>
  <h2>Amount of Visitors: {totalAmount}</h2>
  <div>
    <table>
      <tr>
        <td>Resident ID</td>
        <td>First Name</td>
        <td>Last Name</td>
        <td>Relationship</td>
        <td>Access Start</td>
        <td>Access End</td>
        <td>Delete</td>
      </tr>
      {#each visitors as visitor, i (visitor.id)}
        <tr>
          <td>{visitor.residentId}</td>
          <td>{visitor.firstName}</td>
          <td>{visitor.lastName}</td>
          <td>{visitor.relationship}</td>
          <td>{renderDate(visitor.accessStart)}</td>
          <td>{renderDate(visitor.accessEnd)}</td>
          <td
            ><button
              on:click={() =>
                deleteVisitor(i, visitor.id, visitor.firstName + " " + visitor.lastName)}
              >Delete</button
            ></td
          >
        </tr>
      {/each}
    </table>
  </div>
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
