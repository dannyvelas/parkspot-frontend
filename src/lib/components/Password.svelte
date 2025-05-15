<script lang="ts">
  
  interface Props {
    // props
    name: string;
    placeholder: string;
  }

  let { name, placeholder }: Props = $props();

  // model
  let passwordsShown = $state(false);
  let passwordType = $derived(passwordsShown ? "text" : "password");
  let icon = $derived(passwordsShown ? "mdi:eye" : "mdi:eye-off");

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
  <button type="button" class="border rounded-r flex items-center px-2" onclick={toggleType}>
    <iconify-icon {icon}></iconify-icon>
  </button>
</div>
