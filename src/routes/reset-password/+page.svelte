<script lang="ts">
  import type { PageData } from "./$types";
  import { messageDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { Request } from "$lib/api";
  import Password from "$lib/components/Password.svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // props
  export let data: PageData;

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    const putRes = await new Request(messageDecoder)
      .setAccessToken(data.accessToken)
      .put(`api/user/password`, formObject);
    if (!isOk(putRes)) {
      updateBanner(
        true,
        "Error: it seems like this link has expired. Please go back to the forgot password" +
          " page for a new reset password email."
      );
      return;
    }

    updateBanner(
      false,
      "Success! Your password has been reset. You can try logging in now with the new password."
    );
  }
</script>

<Banner />
<h1 class="font-bold text-center m-4">Enter Your New Password</h1>
<form class="flex flex-col mx-auto w-52 md:w-64 gap-4" on:submit|preventDefault={handleSubmit}>
  <Password name="password" placeholder="New Password" />
  <Password name="confirmPassword" placeholder="Confirm Password" />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Reset Password
  </button>
</form>
