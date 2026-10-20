<template>
  <!-- Perforación del cupón: línea punteada con tijeras de "corta aquí" y muescas a los lados.
       Las muescas son círculos del color de la página; el overflow-hidden de la tarjeta las corta a la mitad.
       Sin margen vertical: empalma con la línea punteada del talón (PostOffer). -->
  <div class="relative h-0" aria-hidden="true">
    <div class="mx-md border-t-2 border-dashed border-hairline-strong" />
    <span class="absolute top-1/2 left-md flex -translate-y-1/2 bg-surface-card px-0.5 text-muted">
      <Icon name="material-symbols:content-cut" size="16" class="-rotate-90" />
    </span>
    <span class="absolute top-1/2 -left-2 size-4 -translate-y-1/2 rounded-full bg-canvas" />
    <span class="absolute top-1/2 -right-2 size-4 -translate-y-1/2 rounded-full bg-canvas" />
  </div>
</template>
