<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = (loadInput) => {
    if (loadInput.url.pathname === "/index" || loadInput.url.pathname === "/index.php") {
      return { status: 302, redirect: "/" };
    }

    return {
      props: {
        status: loadInput.status || undefined,
        message: loadInput.error?.message,
      },
    };
  };
</script>

<script lang="ts">
  export let status: number | undefined;
  export let message: string | undefined;
</script>

<h1>{status}</h1>
<h2>Error: {message}</h2>
