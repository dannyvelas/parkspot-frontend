<script lang="ts">
  import type { PageData } from "./$types";
  import Page from "../Page.svelte";

  export let data: PageData;
</script>

<Page title="Residents and Guest Parking Days" fullInfo={false} {...data} />
