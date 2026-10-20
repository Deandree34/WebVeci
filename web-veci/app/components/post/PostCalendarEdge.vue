<template>
  <!-- Borde de la hoja de calendario recién arrancada: zigzag del color de la tarjeta;
       los huecos dejan ver el fondo de la página, así la tarjeta entera parece la hoja -->
  <span
    class="block h-2 bg-[length:16px_8px] bg-repeat-x"
    :style="{ backgroundImage: 'linear-gradient(135deg, transparent 50%, var(--color-surface-card) 50%), linear-gradient(225deg, transparent 50%, var(--color-surface-card) 50%)' }"
    aria-hidden="true"
  />
</template>
