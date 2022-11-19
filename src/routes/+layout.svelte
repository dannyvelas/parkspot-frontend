<script lang="ts">
  import Nav from "./Nav.svelte";
  import "normalize.css";
  import "../app.css";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Nav session={data.session} />

<main>
  <slot />
</main>
