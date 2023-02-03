<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { permitDecoder, previewPermit } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/convert";
  import { afterNavigate } from "$app/navigation";
  import { deepCopy } from "$lib/copy";
  import List from "./List.svelte";
  import Search from "$lib/components/Search.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";

  // props
  export let listName: permitList;
  export let initialPermits: Result<ListWithMetadata<Permit>>;
  export let session: Session;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let permitsShown = deepCopy(initialPermits);
  let bannerError = "";

  afterNavigate(() => {
    // setting permitsShown in `afterNavigate` this is necessary, otherwise permitsShown will stay stale even when initialPermits changes. the best example of this happens when clicking on a different page number.
    // using a deepCopy instead of initialPermits prevents us from mutating `initialPermits` in the parent whenever we mutate `permitsShown`
    permitsShown = deepCopy(initialPermits);
    console.log("running");
  });

  // events
  const handleSearch = async (event: CustomEvent<Result<Permit[]>>) => {
    if (!isOk(event.detail)) {
      permitsShown = deepCopy(initialPermits);
      bannerError = `Error searching: ${event.detail.message}`;
      return;
    }

    permitsShown.data!.records = event.detail.data;
    bannerError = "";
  };
</script>

<h1>{capitalize(listName)}</h1>

{#if !isOk(initialPermits)}
  {initialPermits.message}
{:else if isOk(initialPermits) && isOk(permitsShown)}
  <div>
    {#if bannerError != ""}
      <div>
        <p>{bannerError}. Please try again later.</p>
      </div>
    {/if}
    <Search
      initialList={initialPermits.data.records}
      decoder={permitDecoder}
      preview={previewPermit}
      totalAmount={permitsShown.data.metadata.totalAmount}
      endpoint={`api/permits/${listName}`}
      on:result={handleSearch}
    />
    <List
      {listName}
      permits={permitsShown.data.records}
      totalAmount={permitsShown.data.metadata.totalAmount}
      user={session.user}
    />
    <Pagination
      totalAmount={permitsShown.data.metadata.totalAmount}
      pageToHref={(pageNum) => `/permits/${listName}?page=${pageNum}`}
      {currPageNum}
    />
  </div>
{/if}
