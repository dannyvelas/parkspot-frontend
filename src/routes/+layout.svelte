<script lang="ts">
  import Nav from "./Nav.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Nav {data} />

<main>
  <slot />
</main>
