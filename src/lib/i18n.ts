import { dictionary, locale, _ } from "svelte-i18n";

function initDictionary(seedLocale: string) {
  dictionary.set({
    en: {
      title: "Welcome to ParkSpot!",
      subtitle: "You'll notice that there are many new changes in our application.",
      listName: "What's New?",
      l0: "You can now use a sidebar to navigate between pages. This sidebar has links where you can see your permits, cars, and visitors.",
      l1: "You can now see all of the cars that you've created visitor parking permits for.",
      l2: "In the permit page, you can choose from cars that have been previously granted a permit.",
      l3: 'To add a new permit, car, or visitor, go the permit/car/visitor page. And, click on the "Create" button to the right of the search bar.',
      rulesName: "Rules",
      rule0: 'Permits can be at most 20 nights.',
      rule1: 'A resident can create at most two permits that will be active on the same night.',
      rule2: 'A resident can give out a maximum of 20 nights worth of parking permits per year.',
      rule3: 'A car can have at most one active permit on a given night.',
      rule4: 'A car can be granted a maximum of 20 nights worth of parking permits per year.',
    },
    es: {
      title: "¡Bienvenido a ParkSpot!",
      subtitle: "Nuestra aplicación ha cambiado mucho.",
      listName: "¿Qué hay de nuevo?",
      l0: "Ahora podrás navegar nuestra aplicación con la nueva barra lateral. Ahí mismo encontrarás enlaces para ver tus permisos, carros y visitantes.",
      l1: "Creamos la página de carros, donde podrás ver la lista de todos los carros que han usado un permiso de visitante.",
      l2: 'En la página de permisos, puedes escoger de tu lista de "carros visitantes".',
      l3: 'Para crear un permiso, sencillamente ve a la página de permisos, y haz clic en el botón que dice "Create" en la parte derecha de la barra de búsqueda.',
      rulesName: "Reglas",
      rule0: 'Los permisos pueden ser de máximo 20 noches.',
      rule1: 'Un residente puede crear como máximo dos permisos que estén activos la misma noche.',
      rule2: 'Un residente puede otorgar un máximo de 20 noches en permisos de estacionamiento por año.',
      rule3: 'Un carro puede tener como máximo un permiso activo en una noche determinada.',
      rule4: 'A un carro se le pueden otorgar como máximo 20 noches en permisos de estacionamiento por año',
    },

  });
  locale.set(seedLocale);
}

export { _, initDictionary, locale };
