<script lang="ts">
  import type { Permit, User } from "$lib/models";
  import { Request } from "$lib/api";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
  import { epochSecondsNow } from "$lib/time";
  import { getLatestToken } from "$lib/auth";

  // props
  export let user: User;
  export let permits: Array<Permit>;

  // events
  const deletePermit = async (i: number, permitID: number) => {
    if (confirm(`Are you sure you want to delete ${permitID}?`)) {
      const delRes = await new Request()
        .setAccessToken(await getLatestToken())
        .delete(`api/permit/${permitID}`);
      if (!isOk(delRes)) {
        alert(`Error deleting permit ${permitID}. Please try again later`);
        return;
      }

      permits = [...permits.slice(0, i), ...permits.slice(i + 1)];

      alert(`Deleted permit ${permitID}`);
    }
  };

  // helpers
  type Status = "Active" | "Expired" | "Active Exception" | "Expired Exception";
  const getStatus = (p: Permit): Status => {
    const now = epochSecondsNow();
    const isActive = p.startDate.getTime() < now && p.endDate.getTime() > now;
    const isException = !p.exceptionReason || p.exceptionReason === "";

    switch (true) {
      case isActive && isException:
        return "Active Exception";
      case isActive && !isException:
        return "Active";
      case !isActive && isException:
        return "Expired Exception";
      default:
        return "Expired";
    }
  };

  const getTWStatusColors = (status: Status): string => {
    switch (status) {
      case "Active Exception":
      case "Expired Exception":
        return "bg-orange-200 text-orange-500";
      case "Active":
        return "bg-green-200 text-green-500";
      default:
        return "bg-rose-200 text-rose-500";
    }
  };
</script>

<div>
  <div class="bg-black rounded text-white mb-2 shadow-md flex flex-row px-8 py-3">
    <span class="text-xs basis-1/6">ID</span>
    <span class="text-xs basis-1/6">Resident ID</span>
    <span class="text-xs basis-1/6">License</span>
    <span class="text-xs basis-2/6">Vehicle</span>
    <span class="text-xs basis-1/6">Status</span>
  </div>
  {#each permits as permit, i (permit.id)}
    <div class="bg-white rounded mb-2 shadow-md flex flex-row px-8 py-3">
      <span class="text-xs basis-1/6 text-zinc-800">{permit.id}</span>
      <span class="text-xs basis-1/6 text-zinc-800">{permit.residentID}</span>
      <span class="text-xs basis-1/6 text-zinc-800">{permit.licensePlate}</span>
      <span class="text-xs basis-2/6 text-zinc-800"
        >{capitalize(permit.color)} {capitalize(permit.make)} {capitalize(permit.model)}</span
      >
      <span
        class="{getTWStatusColors(
          getStatus(permit)
        )} text-xs basis-1/6 text-center rounded-lg px-4 py-0.5"
        >{getStatus(permit)}
      </span>
    </div>
  {/each}
</div>
