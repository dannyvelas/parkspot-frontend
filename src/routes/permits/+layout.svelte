<script lang="ts">
  import type { permitList } from "$lib/models";
  import { capitalize } from "$lib/strings";
  import { page } from "$app/state";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  // model
  let permitTabs: permitList[] = ["all", "active", "expired", "exceptions"];
</script>

<svelte:head>
  <title>Permits</title>
</svelte:head>

<nav class="mb-4">
  <ul class="flex flex-row gap-4 md:gap-12 border-b">
    {#each permitTabs as permitTab}
      <li>
        <a
          href="/permits/{permitTab}"
          class="text-sm text-gray-400"
          class:active={page.url.pathname.endsWith(permitTab)}
        >
          {capitalize(permitTab)}
        </a>
      </li>
    {/each}
  </ul>
</nav>

{@render children?.()}

<style lang="postcss">
  .active {
    @apply border-b-2 border-green-400 text-green-400;
  }
</style>
