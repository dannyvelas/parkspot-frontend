<script lang="ts">
  import type { PageData } from "./$types";
  import Page from "../components/Page.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<Page listName="expired" {...data} />
