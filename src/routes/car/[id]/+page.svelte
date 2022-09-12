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
  <title>Edit Car</title>
</svelte:head>

{#if !isOk(result)}
  <p>Error: {result.message}</p>
{:else}
  <h1>Edit Car</h1>
  {#if form?.response}
    <div>
      <p>{form.response}</p>
    </div>
  {/if}
  <p>License Plate: {result.data.licensePlate}</p>
  <form on:submit|preventDefault={handleSubmit}>
    Color:
    <input type="text" name="color" placeholder={result.data.color} />
    Make:
    <input type="text" name="make" placeholder={result.data.make} />
    Model:
    <input type="text" name="model" placeholder={result.data.model} />
    <button type="submit">Submit</button>
  </form>
{/if}
