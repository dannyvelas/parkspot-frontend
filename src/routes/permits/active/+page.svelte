<script lang="ts">
  import type { PageData } from "./$types";
  import Page from "../Page.svelte";

  export let data: PageData;
</script>

<Page listName="active" initialPermits={data.initialPermits} session={data.session} />
