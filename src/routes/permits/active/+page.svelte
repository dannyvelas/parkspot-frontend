<script lang="ts">
  import type { PageData } from "./$types";
  import Page from "../components/Page.svelte";

  export let data: PageData;
</script>

<Page listName="active" {...data} />
