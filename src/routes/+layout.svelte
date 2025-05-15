<script lang="ts">
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar, { openSidebar } from "$lib/components/Sidebar.svelte";
  import "../app.css";

  
  interface Props {
    // props
    data: PageData;
    children?: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();
</script>

<Sidebar userRole={data.session?.user.role} />

<Nav on:openSidebar={() => openSidebar()} session={data.session} />

<main class="px-4 md:px-10">
  {@render children()}
</main>
