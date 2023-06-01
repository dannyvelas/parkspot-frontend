import { dictionary, locale, _ } from "svelte-i18n";

function initDictionary(seedLocale: string) {
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
  locale.set(seedLocale);
}

export { _, initDictionary, locale };
