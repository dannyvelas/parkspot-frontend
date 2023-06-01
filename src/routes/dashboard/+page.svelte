<script lang="ts">
  import { capitalize } from "$lib/strings";
  import type { PageData } from "./$types";
  import { dictionary, locale, _ } from "svelte-i18n";

  export let data: PageData;

  const capitalRole = capitalize(data.session.user.role);

  dictionary.set({
    en: {
      title: "Welcome to ParkSpot!",
      subtitle: "You'll notice that there are many new changes in our application.",
      listName: "What's New?",
      l0: "You can now use a sidebar to navigate between pages. This sidebar has links where you can see your permits, cars, and visitors.",
      l1: "You can now see all of the cars that you've created visitor parking permits for.",
      l2: "To create a parking permit, you can choose from the cars you've previously created permits for.",
      l3: 'To add a new permit, car, or visitor, go the permit/car/visitor page. And, click on the "Create" button to the right of the search bar.',
    },
    es: {
      title: "¡Bienvenido a ParkSpot!",
      subtitle: "Nuestra aplicación ha cambiado mucho.",
      listName: "¿Qué hay de nuevo?",
      l0: "Ahora, podrás navegar nuestra aplicación con la nueva barra lateral. Ahí mismo encontrarás enlaces para ver tus permisos, carros, y visitantes.",
      l1: "Creamos la página de carros, donde podrás ver la lista de todos los carros que han usado un permiso de vistante",
      l2: "Al crear un permiso nuevo, puedes escoger de tu lista de carros de visitante.",
      l3: `Para crear un permiso, senlillamente ve a la página de permisos, y haz clic en el botón que dice "Create" en la parte derecha de la barra de búsqueda.`,
    },
  });
  locale.set("es");
</script>

<svelte:head>
  <title>{capitalRole} Dashboard</title>
</svelte:head>

<select class="border border-black rounded" bind:value={$locale}>
  <option value="es">Español</option>
  <option value="en">English</option>
</select>

<h1 class="text-xl my-6">{$_("title")}</h1>

<p class="mb-3">{$_("subtitle")}</p>

<h2 class="font-bold mb-3">{$_("listName")}</h2>
<ul class="ml-4 list-disc">
  <li>{$_("l0")}</li>
  <li>{$_("l1")}</li>
  <li>{$_("l2")}</li>
  <li>{$_("l3")}</li>
</ul>
