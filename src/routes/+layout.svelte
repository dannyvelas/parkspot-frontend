<script lang="ts">
  import Nav from "./Nav.svelte";
  import "normalize.css";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Nav user={data.user} />

<main>
  <slot />
</main>
