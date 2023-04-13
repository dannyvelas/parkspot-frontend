<script lang="ts">
  // props
  export let name: string;
  export let placeholder: string;

  // model
  let passwordsShown = false;
  $: passwordType = passwordsShown ? "text" : "password";
  $: icon = passwordsShown ? "mdi:eye" : "mdi:eye-off";

  // events
  function toggleType() {
    passwordsShown = !passwordsShown;
  }
</script>

<div class="flex">
  <input
    required
    type={passwordType}
    class="grow border border-r-0 rounded-l p-2"
    {name}
    {placeholder}
  />
  <button type="button" class="border rounded-r flex items-center px-2" on:click={toggleType}>
    <iconify-icon {icon} />
  </button>
</div>
