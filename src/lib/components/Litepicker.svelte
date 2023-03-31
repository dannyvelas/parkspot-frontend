<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let startDate: Date;
  export let endDate: Date;

  // lifecycle
  onMount(async () => {
    const { Litepicker } = await import("litepicker");
    const litepicker = new Litepicker({
      element: document.getElementById("litepicker") as HTMLElement,
      minDays: 2,
      minDate: startDate,
      singleMode: false,
      format: "MM-DD-YYYY",
    });
    litepicker.setStartDate(startDate);
    litepicker.setEndDate(endDate);

    litepicker.on("selected", (date1, date2) => {
      dispatch("selected", { date1, date2 });
    });
  });

  onDestroy(() => {
    const lpElements = document.getElementsByClassName("litepicker");
    for (let i = 0; i < lpElements.length; i++) {
      lpElements[i].remove();
    }
  });
</script>

<input readonly id="litepicker" class="border rounded p-2 text-center" />
