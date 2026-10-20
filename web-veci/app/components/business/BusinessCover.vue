<script setup lang="ts">
/** Portada del perfil: la foto del negocio o, sin ella, el degradado de VECI con el ícono del giro. */
defineProps<{ src?: string, icon: string }>()
</script>

<template>
  <div class="relative h-40 overflow-hidden bg-veci-gradient md:h-72 md:rounded-b-card" aria-hidden="true">
    <img v-if="src" :src="src" alt="" class="size-full object-cover">
    <template v-else>
      <Icon :name="icon" size="320" class="absolute -right-10 -bottom-20 rotate-[-12deg] text-on-primary opacity-15" />
      <Icon :name="icon" size="120" class="absolute top-6 left-[38%] rotate-12 text-on-primary opacity-10" />
    </template>
    <!-- Sombra inferior para que el logo superpuesto se despegue de la portada -->
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
  </div>
</template>
