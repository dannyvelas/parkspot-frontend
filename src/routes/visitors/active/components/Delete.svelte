<script lang="ts">
  import type { Visitor } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { monthDayYearDate } from "$lib/time";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let item: Visitor;

  // events
  async function handleSubmit() {
    const delRes = await new Request()
      .setAccessToken(await getLatestToken())
      .delete(`api/visitor/${item.id}`);
    if (!isOk(delRes)) {
      updateBanner(true, delRes.message);
      return;
    }

    dispatch("deleted", item);
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  on:submit|preventDefault={handleSubmit}
>
  <Banner />
  <p class="text-center">Delete the following visitor?</p>
  <table>
    <tr>
      <td class="font-bold">First</td><td>{item.firstName}</td>
    </tr>
    <tr>
      <td class="font-bold">Last</td><td>{item.lastName}</td>
    </tr>
    <tr>
      <td class="font-bold">Access Start</td><td>{monthDayYearDate(item.accessStart)}</td>
    </tr>
    <tr>
      <td class="font-bold">Access End</td><td>{monthDayYearDate(item.accessEnd)}</td>
    </tr>
  </table>
  <button type="submit" class="bg-rose-400 text-white text-center border rounded px-4 py-1">
    Delete Visitor
  </button>
</form>
