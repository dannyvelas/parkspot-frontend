<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import { submitWithToken } from "$lib/form";

  // props
  export let data: PageData;
  export let form: Record<string, any> | undefined;
  $: result = data.result;

  // events
  function handleSubmit() {
    submitWithToken(this, data.session.accessToken);
  }
</script>

<svelte:head>
  <title>Edit Resident</title>
</svelte:head>

{#if !isOk(result)}
  <p>Error: {result.message}</p>
{:else}
  <h1>Edit Resident</h1>
  {#if form?.response}
    <div>
      <p>{form.response}</p>
    </div>
  {/if}
  <p>Resident Account: {result.data.id}</p>
  <form on:submit|preventDefault={handleSubmit}>
    First Name:
    <input type="text" name="firstName" placeholder={result.data.firstName} />
    Last Name:
    <input type="text" name="lastName" placeholder={result.data.lastName} />
    Phone:
    <input type="text" name="phone" placeholder={result.data.phone} />
    Email:
    <input type="text" name="email" placeholder={result.data.email} />
    <button type="submit">Submit</button>
  </form>
{/if}
