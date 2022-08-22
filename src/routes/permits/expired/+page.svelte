<script lang="ts">
  import type { PageData } from "./$types";
  import Template from "../Template.svelte";

  export let data: PageData;
</script>

<Template listName="expired" result={data.result} userRole={data.userRole} limit={data.limit} />
