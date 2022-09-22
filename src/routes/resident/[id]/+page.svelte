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
    submitWithToken(this, { resetForm: false });
  }
</script>

<svelte:head>
  <title>Edit Resident</title>
</svelte:head>

{#if !isOk(result)}
  <p>Error: {result.message}</p>
{:else}
  <header>
    <h1>Edit Resident</h1>
    {#if form?.response}
      <div>
        <p>{form.response}</p>
      </div>
    {/if}
    <p>Resident ID: {result.data.id}</p>
  </header>
  <form on:submit|preventDefault={handleSubmit}>
    First Name:
    <input type="text" name="firstName" placeholder={result.data.firstName} />
    Last Name:
    <input type="text" name="lastName" placeholder={result.data.lastName} />
    Phone:
    <input type="text" name="phone" placeholder={result.data.phone} />
    Email:
    <input type="text" name="email" placeholder={result.data.email} />
    Amount of Parking Days Used:
    <input
      type="text"
      name="amtParkingDaysUsed"
      placeholder={result.data.amtParkingDaysUsed.toString()}
    />
    <div style="margin:20px;">
      <label for="unlimDays">Unlimited Days: </label>
      <input
        type="checkbox"
        name="unlimDays"
        id="unlimDays"
        value="true"
        bind:checked={result.data.unlimDays}
      />
    </div>
    <button type="submit">Submit</button>
  </form>
{/if}

<style>
  header {
    text-align: center;
  }

  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input[type="text"] {
    padding: 12px 20px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
