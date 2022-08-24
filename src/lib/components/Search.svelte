<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Decoder } from "decoders";
  import { createEventDispatcher } from "svelte";
  import { MAX_AMT_PER_PAGE } from "$lib/constants";
  import { listWithMetadataDecoder } from "$lib/models";
  import { get } from "$lib/api";
  import { isOk, newOk, newErr } from "$lib/functional";

  // config
  const dispatch = createEventDispatcher();

  // props
  type T = $$Generic;
  export let initialList: Array<T>;
  export let decoder: Decoder<T>;
  export let preview: (a: T) => string;
  export let totalAmount: number;
  export let endpoint: string;

  // model
  let searchVal = "";

  // events
  const onSearch = async () => {
    const listRes = await search();
    dispatch("result", listRes);
  };

  const search = async (): Promise<Result<T[]>> => {
    if (searchVal === "") {
      return newOk(initialList);
    }

    if (totalAmount === initialList.length) {
      return newOk(
        initialList.filter((single) => {
          const asString = preview(single).toLowerCase();
          return asString.includes(searchVal.toLowerCase());
        })
      );
    }

    const getRes = await get(endpoint, { search: searchVal }, listWithMetadataDecoder(decoder));
    if (!isOk(getRes)) {
      return newErr(getRes.message);
    }

    return newOk(getRes.data.records);
  };
</script>

{#if totalAmount < MAX_AMT_PER_PAGE}
  <input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search" />
{:else}
  <input type="text" bind:value={searchVal} placeholder="Search" />
  <button on:click={onSearch}>Search</button>
{/if}
