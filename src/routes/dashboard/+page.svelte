<script lang="ts">
  import { capitalize } from "$lib/strings";
  import type { PageData } from "./$types";

  export let data: PageData;

  const capitalRole = capitalize(data.session.user.role);
</script>

<svelte:head>
  <title>{capitalRole} Dashboard</title>
</svelte:head>

<h1 class="text-3xl font-bold underline">Welcome, {capitalize(data.session.user.firstName)}!</h1>

<style>
  h1 {
    margin: 0;
  }
</style>
