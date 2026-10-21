<script setup lang="ts">
/**
 * Portada del perfil: la foto del negocio o, sin ella, fondo carbón con el ícono del giro en ocre
 * (como el logo: el ocre acompaña, no cubre superficies grandes).
 */
defineProps<{ src?: string, icon: string }>()
</script>

<template>
  <div class="relative h-40 overflow-hidden bg-surface-elevated md:h-72 md:rounded-b-card" aria-hidden="true">
    <img v-if="src" :src="src" alt="" class="size-full object-cover">
    <template v-else>
      <Icon :name="icon" size="320" class="absolute -right-10 -bottom-20 rotate-[-12deg] text-brand opacity-25" />
      <Icon :name="icon" size="120" class="absolute top-6 left-[38%] rotate-12 text-brand opacity-15" />
    </template>
    <!-- Sombra inferior para que el logo superpuesto se despegue de la portada -->
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
  </div>
</template>
