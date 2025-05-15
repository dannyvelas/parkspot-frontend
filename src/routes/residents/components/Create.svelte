<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { residentDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner, clearBanner } from "$lib/components/Banner.svelte";
  import Password from "$lib/components/Password.svelte";

  // config
  const dispatch = createEventDispatcher();

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());
    const result = await new Request(residentDecoder)
      .setAccessToken(await getLatestToken())
      .post("api/resident", formObject);
    if (!isOk(result)) {
      updateBanner(true, result.message);
      return;
    }

    clearBanner();
    dispatch("created", result.data);
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  onsubmit={preventDefault(handleSubmit)}
>
  <Banner />
  <p class="text-center font-bold text-lg">Create Resident</p>
  <input required class="border rounded p-2" name="id" placeholder="Enter Resident ID" />
  <input required class="border rounded p-2" name="firstName" placeholder="Enter First Name" />
  <input required class="border rounded p-2" name="lastName" placeholder="Enter Last Name" />
  <input required class="border rounded p-2" name="phone" placeholder="Enter Phone" />
  <input required class="border rounded p-2" name="email" placeholder="Enter Email" />
  <Password name="password" placeholder="Enter Password" />
  <Password name="confirmPassword" placeholder="Confirm Password" />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Create Resident
  </button>
</form>
