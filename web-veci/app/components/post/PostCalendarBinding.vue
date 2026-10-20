<template>
  <!-- Encuadernado de la hoja de calendario: dos argollas que entran por sus perforaciones.
       Va dentro de la tarjeta, bajo el zigzag (las líneas punteadas las pone `PostAvailability`). -->
  <div class="relative h-4" aria-hidden="true">
    <span v-for="side in ['left-1/4', 'right-1/4']" :key="side" class="absolute top-0 flex flex-col items-center" :class="side">
      <!-- Argolla: sube desde la perforación y sale por el borde de arriba -->
      <span class="-mt-3 h-6 w-3 rounded-full border-[3px] border-muted-soft" />
      <!-- Perforación: del color de la página, con sombra interior para que se vea hundida -->
      <span class="-mt-2 size-4 rounded-full bg-canvas shadow-[inset_0_1px_2px_rgb(0_0_0/0.6)]" />
    </span>
  </div>
</template>
