<script lang="ts">
  // model
  export let banner = { isError: false, msg: "" };

  // styles
  $: colors = banner.isError ? "bg-rose-200 border-rose-500" : "bg-green-200 border-green-500";
</script>

{#if banner.msg != ""}
  <div class="min-w-full {colors} rounded-md border p-2">
    <p class="text-sm">{banner.msg}</p>
  </div>
{/if}
